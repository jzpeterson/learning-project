import {
    createConversation,
    selectActiveConversationsBetweenAccountAndRecipient,
    updateConversationStatusByRecipientAndAccountPhoneNumber
} from "../db/repositories/ConversationRepository";
import {getParams} from "./utils/base64Decoder";
import {ConversationStatus} from "./enums/ConversationStatus";
import {sendTwilioMessage} from "../clients/twilioClient";
import {MessageDirection} from "./enums/MessageDirection";
import {addMessageToConversation} from "../db/repositories/MessageRepository";
import {ContentTypes} from "./enums/ContentTypes";
import {generateNextResponse} from "./responseGenerator";

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

    const generatedMessage = await generateNextResponse(createdConversation.id)

    await sendTwilioMessage(generatedMessage, accountPhoneNumber, recipientPhoneNumber);

    const message = {
        direction: MessageDirection.OUTBOUND,
        content_type: ContentTypes.TEXT,
        content: generatedMessage
    }
    await addMessageToConversation(createdConversation.id, message);
}

export async function handleIncomingMessage(event: any): Promise<string> {
    const params = await getParams(event);

    const conversation =
        await find_or_create_conversation(params.accountPhoneNumber, params.recipientPhoneNumber);

    const messageForRecipient = {
        direction: MessageDirection.INBOUND,
        content_type: ContentTypes.TEXT,
        content: params.message
    }

    await addMessageToConversation(conversation.id, messageForRecipient);

    const generatedMessage = await generateNextResponse(conversation.id);

    const messageForAccount = {
        direction: MessageDirection.OUTBOUND,
        content_type: ContentTypes.TEXT,
        content: generatedMessage
    }

    await addMessageToConversation(conversation.id, messageForAccount);
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

