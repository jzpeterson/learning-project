import {
    createConversation,
    selectActiveConversationsBetweenaccountAndRecipient,
    updateConversationStatusByRecipientAndAccountPhoneNumber
} from "../db/repositories/ConversationRepository";
import {getParams} from "./utils/base64Decoder";
import {ConversationStatus} from "./enums/ConversationStatus";
import {sendTwilioMessage} from "../clients/twilioClient";
import {MessageDirection} from "./enums/MessageDirection";
import {addMessageToConversation} from "../db/repositories/MessageRepository";
import {ContentTypes} from "./enums/ContentTypes";

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

    const generatedMessage = "Hey"

    await sendTwilioMessage(generatedMessage, accountPhoneNumber, recipientPhoneNumber);

    const message = {
        direction: MessageDirection.OUTBOUND,
        content_type: ContentTypes.TEXT,
        content: generatedMessage
    }
    await addMessageToConversation(createdConversation.id, message);
}

export async function generateNextResponse(event: any) {
    const params = await getParams(event);
    const currentConversation = await find_or_create_conversation(
        params.accountPhoneNumber, params.recipientPhoneNumber);
    // addMessageToConversation('currentConversation.ConversationID', "Check if the twilio response is working", MessageDirection.INBOUND, "text");
}

async function find_or_create_conversation(accountPhoneNumber: string, recipientPhoneNumber: string) {
    const existingConversations = await selectActiveConversationsBetweenaccountAndRecipient(
        recipientPhoneNumber,
        accountPhoneNumber);

    if (existingConversations.length === 0) {
        // return await createConversation(recipientPhoneNumber, accountPhoneNumber);
    }
    return existingConversations[0]; // TODO find the most recent conversation
}

