import {
    createConversation,
    getConversationById,
    getConversationsByInternalPhoneNumber,
    selectActiveConversationsBetweenAccountAndRecipient,
    selectConversationsBetweenInternalAndExternalPhoneNumber,
    updateConversationStatusByRecipientAndAccountPhoneNumber
} from "../db/repositories/ConversationRepository";
import {ConversationStatus} from "./enums/ConversationStatus";
import {MessageDirection} from "./enums/MessageDirection";
import {ContentTypes} from "./enums/ContentTypes";
import {CustomMessage, MessageService} from "./MessageService";
import {TwilioClient} from "../clients/TwilioClient";
import {ExternalMessageParamDecoder} from "./utils/ExternalMessageParamDecoder";
import {
    Conversation,
    ConversationResponseGenerator,
    convertBetweenDbAndApplicationConversationTypes,
    Message
} from "./ConversationResponseGenerator";
import {PhoneNumberValidator} from "./utils/PhoneNumberValidator";
import {AccountClient} from "../dynamoDb/AccountClient";

const twilioClient: TwilioClient = new TwilioClient();
const accountClient: AccountClient = new AccountClient();
const messageService: MessageService = new MessageService();
const externalMessageParamDecoder: ExternalMessageParamDecoder = new ExternalMessageParamDecoder();
const responseGenerator: ConversationResponseGenerator = new ConversationResponseGenerator();

export async function initiateConversation(internalPhoneNumber: string, externalPhoneNumber: string) {
    const validatedInternalPhoneNumber = PhoneNumberValidator.validatePhoneNumber(internalPhoneNumber);
    const validatedExternalPhoneNumber = PhoneNumberValidator.validatePhoneNumber(externalPhoneNumber);
    console.log("Initiating conversation between", validatedInternalPhoneNumber, "and", validatedExternalPhoneNumber);

    await updateConversationStatusByRecipientAndAccountPhoneNumber(
        internalPhoneNumber, externalPhoneNumber, ConversationStatus.TERMINATED_INCOMPLETE);

    const newConversation = {
        recipient_phone_number: validatedExternalPhoneNumber,
        account_phone_number: validatedInternalPhoneNumber,
        last_update_time: new Date(),
        status: ConversationStatus.ACTIVE
    }

    const createdConversation = await createConversation(newConversation)

    const convertedConversation: Conversation = await convertBetweenDbAndApplicationConversationTypes(createdConversation)

    const account = await accountClient.getAccountByPhoneNumber(validatedInternalPhoneNumber);

    if (!account) {
        throw new Error("Account not found for phone number: " + validatedInternalPhoneNumber);
    }
    const generatedMessage = await responseGenerator.generateNextResponseV1(account, convertedConversation);

    const message: CustomMessage = {
        content_type: ContentTypes.TEXT,
        direction: MessageDirection.OUTBOUND,
        content: generatedMessage
    }
    await messageService.addMessage(convertedConversation.id, message);
    // Should not send external message if we could not save the message to the DB.
    await twilioClient.sendTwilioMessage(generatedMessage, internalPhoneNumber, externalPhoneNumber);
}

export async function retrieveMostRecentMessage(internalPhoneNumber: string,
                                                externalPhoneNumber: string,
                                                messageType: ContentTypes): Promise<Message | null> {
    const validatedInternalPhoneNumber = PhoneNumberValidator.validatePhoneNumber(internalPhoneNumber);
    const validatedExternalPhoneNumber = PhoneNumberValidator.validatePhoneNumber(externalPhoneNumber);
    const conversations = await selectConversationsBetweenInternalAndExternalPhoneNumber(
        validatedExternalPhoneNumber, validatedInternalPhoneNumber);

    if (conversations.length === 0) {
        throw new Error("No active conversation found between " + validatedInternalPhoneNumber + " and " + validatedExternalPhoneNumber);
    }

    let mostRecentMessage: Message | null = null;
    let latestTimestamp: Date = new Date(0); // Epoch start
    const convertedConversations: Conversation[] = conversations.map(convertBetweenDbAndApplicationConversationTypes);
    convertedConversations.forEach(conversation => {
        console.log("Checking conversation", conversation)
        if (conversation.messages) {
            console.log("Conversation has messages", conversation.messages.length)
            conversation.messages.forEach(message => {
                console.log("Checking message", message)
                if (message.contentType === messageType && message.direction === 'INBOUND') {
                    console.log("Found message with expected content type", message)
                    const messageTimestamp = new Date(message.timestamp);
                    if (messageTimestamp > latestTimestamp) {
                        latestTimestamp = messageTimestamp;
                        mostRecentMessage = message;
                    }
                }

            });
        }
    });

    if (!mostRecentMessage) {
        throw new Error("No video messages found for the given numbers.");
    }

    return mostRecentMessage;
}

export async function retrieveConversationsByNumber(internalPhoneNumber: string,
                                                    externalPhoneNumber?: string,
                                                    latestVideoMessage?: boolean): Promise<Conversation[]> {
    const validatedInternalPhoneNumber = PhoneNumberValidator.validatePhoneNumber(internalPhoneNumber);
    const conversations = await getConversationsByInternalPhoneNumber(validatedInternalPhoneNumber);
    let convertedConversations: Conversation[] = conversations.map(convertBetweenDbAndApplicationConversationTypes);

    if (externalPhoneNumber) {
        const validatedExternalPhoneNumber = PhoneNumberValidator.validatePhoneNumber(externalPhoneNumber);
        convertedConversations = convertedConversations.filter((conversation) => {
            return conversation.externalPhoneNumber === validatedExternalPhoneNumber;
        });
    }

    return Promise.all(convertedConversations);
}

export async function handleIncomingMessage(event: any): Promise<string> {
    const inboundMessageParams = await externalMessageParamDecoder.getParams(event);

    const conversation =
        await find_or_create_conversation(inboundMessageParams.internalPhoneNumber, inboundMessageParams.externalPhoneNumber);
    const conversationWithMessages = await getConversationById(conversation.id);
    console.log("Adding inbound message to conversation", conversationWithMessages.id, inboundMessageParams)
    await messageService.addInboundMessage(conversationWithMessages.id, inboundMessageParams)

    const convertedConversation: Conversation = await convertBetweenDbAndApplicationConversationTypes(conversationWithMessages)

    const account = await accountClient.getAccountByPhoneNumber(inboundMessageParams.internalPhoneNumber);

    if (!account) {
        throw new Error("Account not found for phone number: " + inboundMessageParams.internalPhoneNumber);
    }

    const generatedMessage = await responseGenerator.generateNextResponseV1(account, convertedConversation);

    const accountToRecipientMessage: CustomMessage = {
        direction: MessageDirection.OUTBOUND,
        content: generatedMessage,
        content_type: ContentTypes.TEXT
    }
    console.log("Sending Outbound message to", inboundMessageParams.internalPhoneNumber, "from", inboundMessageParams.externalPhoneNumber, ":", generatedMessage)
    await messageService.addMessage(conversation.id, accountToRecipientMessage)
    return generatedMessage
}

async function find_or_create_conversation(accountPhoneNumber: string, recipientPhoneNumber: string): Promise<Conversation> {
    const existingConversations = await selectActiveConversationsBetweenAccountAndRecipient(
        recipientPhoneNumber,
        accountPhoneNumber);
    console.log("Existing Conversations for", recipientPhoneNumber, "and", accountPhoneNumber, existingConversations)

    if (existingConversations.length === 0) {
        const conversation = {
            'recipient_phone_number': recipientPhoneNumber,
            'account_phone_number': accountPhoneNumber,
            'last_update_time': new Date(),
            'status': ConversationStatus.ACTIVE
        };
        const conv = await createConversation(conversation);
        return convertBetweenDbAndApplicationConversationTypes(conv);
    }
    // TODO Find the most recent conversation
    return convertBetweenDbAndApplicationConversationTypes(existingConversations[0]);
}

