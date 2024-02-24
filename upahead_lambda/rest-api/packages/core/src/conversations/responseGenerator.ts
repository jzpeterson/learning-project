import {getMessagesForConversation} from "../db/repositories/MessageRepository";
import {Message} from "../db/types/public/Message";
import {MessageDirection} from "./enums/MessageDirection";
import {updateConversationStatus} from "../db/repositories/ConversationRepository";
import {ConversationStatus} from "./enums/ConversationStatus";

export async function generateNextResponse(conversationId: string): Promise<string> {
    console.log("Generating next response for conversationId", conversationId)
    const messages = await getMessagesForConversation(conversationId);
    console.log("conversation ID", conversationId)
    console.log("messages for conversationId", messages)

    const index = await calculateNextMessageIndex(messages);
    if (index >= Object.keys(conversationConfiguration).length - 1) {
        completeConversation(conversationId).then(() =>
            console.log("Conversation status updated to completed"));
    }
    // TODO I could make this more readable and cleaner. I am assuming that if
    // there is not a message config then the conversation is completed
    const messageConfig = conversationConfiguration[index.toString()];
    if (!messageConfig) {
        completeConversation(conversationId).then(() =>
            console.log("Conversation status updated to completed"));
        return 'Default message';
    }
    return messageConfig.messageText;
}

async function completeConversation(conversationId: string) {
    return await updateConversationStatus(conversationId, ConversationStatus.COMPLETED);
}

async function calculateNextMessageIndex(messages: Message[]): Promise<number> {
    if (!messages) {
        console.log("No messages found returning index 0")
        return 0;
    }

    const outboundMessages = messages.filter(
        message => message.direction == MessageDirection.OUTBOUND);
    console.log("outboundMessages", outboundMessages)

    if (outboundMessages.length === 0) {
        console.log("No outbound messages found returning index 0")
        return 0;
    }
    const index = outboundMessages.length;
    console.log("Returning index", index)

    return index;
}

const conversationConfiguration = {
    '0':{
        messageText: 'First Message',
    },
    '1':{
        messageText: 'Second Message',
    },
    '2':{
        messageText: 'Third Message',
    },
}