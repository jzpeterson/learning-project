import {describe, expect, it} from "vitest";
import {MessageDirection} from "../../src/conversations/enums/MessageDirection";
import {ContentTypes} from "../../src/conversations/enums/ContentTypes";
import {addMessageToConversation, getMessagesForConversation} from "../../src/db/repositories/MessageRepository";
import {ConversationStatus} from "../../src/conversations/enums/ConversationStatus";
import {createConversationForTest} from "./ConversationRepository.test";

export async function createMessageForTest(conversation_id: string, direction: MessageDirection, content_type: ContentTypes, content: string) {
    const message = {
        direction: direction,
        content_type: content_type,
        content: content
    };

    return await addMessageToConversation(conversation_id, message);
}

describe('MessageRepository', () => {
    const recipient_phone_number = '8017916516';
    const account_phone_number = '1111111111';

    it('should add a message to a conversation', async () => {
        // Given
        const createdConversation = await createConversationForTest(recipient_phone_number,
            account_phone_number, ConversationStatus.ACTIVE);
        console.log(createdConversation)

        const message = {
            direction: MessageDirection.INBOUND,
            content_type: ContentTypes.TEXT,
            content: 'Hello, World!'
        };

        // When
        const result = await addMessageToConversation(createdConversation.id, message);
        console.log(result)

        // Then
        expect(result.conversation_id).toEqual(createdConversation.id);
        expect(result.direction).toEqual(MessageDirection.INBOUND);
        expect(result.content_type).toEqual(ContentTypes.TEXT);
        expect(result.content).toEqual('Hello, World!');
        expect(result.id).toBeDefined();
        expect(result.timestamp).toBeDefined();
    });

    it('should return all messages in the conversation', async () => {
        // Given
        const created_conversation = await createConversationForTest(recipient_phone_number,
            account_phone_number, ConversationStatus.ACTIVE);
        console.log(created_conversation)
        const firstMessage = await createMessageForTest(created_conversation.id, MessageDirection.OUTBOUND,
            ContentTypes.TEXT, 'SEND ME A COOL VIDEO!!!!!');
        console.log(firstMessage)
        const secondMessage = await createMessageForTest(created_conversation.id, MessageDirection.INBOUND,
            ContentTypes.TEXT, 'NEVER!!!!!!');
        console.log(secondMessage)

        // When
        const conversation = await getMessagesForConversation(created_conversation.id);
        console.log(conversation)

        // Then
        expect(conversation).toHaveLength(2);
        expect(conversation[0].id).toEqual(firstMessage.id);
        expect(conversation[1].id).toEqual(secondMessage.id);
    });
});
