import {getMessagesForConversation} from "../db/repositories/MessageRepository";
import {Message} from "../db/types/public/Message";
import {MessageDirection} from "./enums/MessageDirection";

export async function generateNextResponse(conversationId: string): Promise<string> {
    console.log("Generating next response for conversationId", conversationId)
    const messages = await getMessagesForConversation(conversationId);
    console.log("conversation ID", conversationId)
    console.log("messages for conversationId", messages)

    const index = await calculateNextMessageIndex(messages);

    const messageConfig = conversationConfiguration[index.toString()];
    if (!messageConfig) {
        return 'Default message';
    }
    return messageConfig.messageText;
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