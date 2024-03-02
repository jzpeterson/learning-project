import { getMessagesForConversation } from "../db/repositories/MessageRepository";
import { Message } from "../db/types/public/Message";
import { MessageDirection } from "./enums/MessageDirection";
import { updateConversationStatus } from "../db/repositories/ConversationRepository";
import { ConversationStatus } from "./enums/ConversationStatus";

export class ConversationResponseGenerator {
    private conversationConfiguration = {
        '0': { messageText: 'First Message' },
        '1': { messageText: 'Second Message' },
        '2': { messageText: 'Third Message' },
    };

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
