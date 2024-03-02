import {getMessagesForConversation} from "../db/repositories/MessageRepository";
// import {Message} from "../db/types/public/Message";
import {MessageDirection} from "./enums/MessageDirection";
import {updateConversationStatus} from "../db/repositories/ConversationRepository";
import {ConversationStatus} from "./enums/ConversationStatus";
import {ContentTypes} from "./enums/ContentTypes";
import {Account, ConversationConfiguration} from "../dynamoDb/AccountClient";

export class ConversationResponseGenerator {
    private conversationConfiguration = {
        '0': { messageText: 'First Message' },
        '1': { messageText: 'Second Message' },
        '2': { messageText: 'Third Message' },
    };

    public async generateNextResponseV1(account: Account, conversation: Conversation): Promise<string> {
        const conversationConfiguration: ConversationConfiguration = account.conversationConfiguration;
        if (!conversationConfiguration) {
            throw new Error("No conversation configuration found for account " + account.toString());
        }
        const messages: Message[] = conversation.messages;

        if (!messages) {
            console.log("No messages found returning first message");
            return conversationConfiguration.firstMessage;
        }

        const outboundMessages = messages.filter(message => message.direction == MessageDirection.OUTBOUND);
        const outboundMessageCount = outboundMessages.length;

        if(outboundMessageCount === 0) {
            return conversationConfiguration.firstMessage;
        }
        // TODO make this more robust to handle multiple configured messages
        return conversationConfiguration.lastMessage;
    }

    public async generateNextResponse(conversationId: string): Promise<string> {
        console.log("Generating next response for conversationId", conversationId);
        const messages = await getMessagesForConversation(conversationId);
        console.log("conversation ID", conversationId);
        console.log("messages for conversationId", messages);

        const index = await this.calculateNextMessageIndex(messages);
        if (index >= Object.keys(this.conversationConfiguration).length - 1) {
            this.completeConversation(conversationId).then(() =>
                console.log("Conversation status updated to completed"));
        }

        const messageConfig = this.conversationConfiguration[index.toString()];
        if (!messageConfig) {
            this.completeConversation(conversationId).then(() =>
                console.log("Conversation status updated to completed"));
            return 'Default message';
        }
        return messageConfig.messageText;
    }

    private async completeConversation(conversationId: string) {
        return await updateConversationStatus(conversationId, ConversationStatus.COMPLETED);
    }

    private async calculateNextMessageIndex(messages: Message[]): Promise<number> {
        if (!messages) {
            console.log("No messages found returning index 0");
            return 0;
        }

        const outboundMessages = messages.filter(
            message => message.direction == MessageDirection.OUTBOUND);
        console.log("outboundMessages", outboundMessages);

        if (outboundMessages.length === 0) {
            console.log("No outbound messages found returning index 0");
            return 0;
        }
        const index = outboundMessages.length;
        console.log("Returning index", index);

        return index;
    }
}

export interface Conversation {
    id: string;
    internalPhoneNumber: string;
    externalPhoneNumber: string;
    timestamp: Date;
    status: ConversationStatus;
    messages: Message[];
}

export interface Message {
    id: string;
    conversationId: string;
    direction: MessageDirection;
    contentType: ContentTypes;
    content: string;
    timestamp: Date;
}

export function convertBetweenDbAndApplicationConversationTypes(dbConversation: any): Promise<Conversation> {
    return {
        id: dbConversation.id,
        internalPhoneNumber: dbConversation.account_phone_number,
        externalPhoneNumber: dbConversation.recipient_phone_number,
        timestamp: dbConversation.last_update_time,
        status: dbConversation.status,
        messages: dbConversation.messages,
    }
}

export async function convertBetweenDBAndApplicationMessages(dbMessages: any[]): Promise<Message[]> {
    return dbMessages.map((dbMessage) => ({
        id: dbMessage.id,
        conversationId: dbMessage.conversation_id,
        direction: dbMessage.direction,
        contentType: dbMessage.content_type,
        content: dbMessage.content,
        timestamp: dbMessage.timestamp,
    }));
}
