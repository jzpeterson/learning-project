import {
    createConversation, getConversationsByAccountPhoneNumber,
    selectActiveConversationsBetweenAccountAndRecipient,
    updateConversationStatusByRecipientAndAccountPhoneNumber
} from "../db/repositories/ConversationRepository";
import {ConversationStatus} from "./enums/ConversationStatus";
import {MessageDirection} from "./enums/MessageDirection";
import {ContentTypes} from "./enums/ContentTypes";
import {CustomMessage, MessageService} from "./MessageService";
import {TwilioClient} from "../clients/TwilioClient";
import {ExternalMessageParamDecoder} from "./utils/ExternalMessageParamDecoder";
import {ConversationResponseGenerator} from "./ConversationResponseGenerator";

const twilioClient: TwilioClient = new TwilioClient();
const messageService: MessageService = new MessageService();
const externalMessageParamDecoder = new ExternalMessageParamDecoder();
const responseGenerator: ConversationResponseGenerator = new ConversationResponseGenerator();
export async function initiateConversation(accountPhoneNumber: string, recipientPhoneNumber: string) {
    await updateConversationStatusByRecipientAndAccountPhoneNumber(recipientPhoneNumber,
        accountPhoneNumber, ConversationStatus.TERMINATED_INCOMPLETE);

    const newConversation = {
        recipient_phone_number: recipientPhoneNumber,
        account_phone_number: accountPhoneNumber,
        last_update_time: new Date(),
        status: ConversationStatus.ACTIVE
    }
    const createdConversation = await createConversation(newConversation)

    const generatedMessage = await responseGenerator.generateNextResponse(createdConversation.id)

    await twilioClient.sendTwilioMessage(generatedMessage, accountPhoneNumber, recipientPhoneNumber);

    const message: CustomMessage = {
        direction: MessageDirection.OUTBOUND,
        content: generatedMessage
    }
    await messageService.addMessage(createdConversation.id, message);
}

export async function retrieveConversationsByNumber(accountPhoneNumber: string, utcDate: string) {
    const conversations = await getConversationsByAccountPhoneNumber(accountPhoneNumber);
    return conversations;
}

export async function handleIncomingMessage(event: any): Promise<string> {
    const inboundMessageParams = await externalMessageParamDecoder.getParams(event);

    const conversation =
        await find_or_create_conversation(inboundMessageParams.accountPhoneNumber, inboundMessageParams.recipientPhoneNumber);

    console.log("Adding inbound message to conversation", conversation.id, inboundMessageParams)
    await messageService.addInboundMessage(conversation.id, inboundMessageParams)

    const generatedMessage = await responseGenerator.generateNextResponse(conversation.id);

    const accountToRecipientMessage: CustomMessage = {
        direction: MessageDirection.OUTBOUND,
        content: generatedMessage,
        content_type: ContentTypes.TEXT
    }
    console.log("Sending Outbound message to", inboundMessageParams.accountPhoneNumber, "from", inboundMessageParams.recipientPhoneNumber, ":", generatedMessage)
    await messageService.addMessage(conversation.id, accountToRecipientMessage)
    return generatedMessage
}

async function find_or_create_conversation(accountPhoneNumber: string, recipientPhoneNumber: string) {
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
        return await createConversation(conversation);
    }
    // TODO Find the most recent conversation
    return existingConversations[0];
}

