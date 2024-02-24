import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as ConversationRepository from "../../src/db/repositories/ConversationRepository";
import * as MessageRepository from '../../src/db/repositories/MessageRepository';
import { generateNextResponse } from '../../src/conversations/responseGenerator';
import { Message } from '../../src/db/types/public/Message';
import { MessageDirection } from '../../src/conversations/enums/MessageDirection';

vi.mock('../../src/db/repositories/MessageRepository', () => ({
    getMessagesForConversation: vi.fn(),
}));

vi.mock('../../src/db/repositories/ConversationRepository', () => ({
    updateConversationStatus: vi.fn(),
}));

describe('generateNextResponse', () => {
    beforeEach(() => {
        vi.resetAllMocks(); // resetAllMocks and clearAllMocks both work here. I don't know why :shrug
    });
    it('should generate the first response if no messages are found', async () => {
        // Given
        MessageRepository.getMessagesForConversation.mockResolvedValueOnce([]);

        // When
        const response = await generateNextResponse('conversationId1');

        // Then
        expect(response).toBe('First Message');
        expect(MessageRepository.getMessagesForConversation).toHaveBeenCalledWith('conversationId1');
        expect(ConversationRepository.updateConversationStatus).not.toHaveBeenCalled();
    });

    it('should generate the correct response based on the number of outbound messages', async () => {
        // Given
        // Simulate a scenario where there are two outbound messages
        const mockMessages: Message[] = [
            { direction: MessageDirection.OUTBOUND, content: 'Hello', timestamp: new Date() },
            { direction: MessageDirection.OUTBOUND, content: 'How are you?', timestamp: new Date() },
        ];
        MessageRepository.getMessagesForConversation.mockResolvedValueOnce(mockMessages);

        // When
        const response = await generateNextResponse('conversationId2');

        // Then
        expect(response).toBe('Third Message');
        expect(MessageRepository.getMessagesForConversation).toHaveBeenCalledWith('conversationId2');
        expect(ConversationRepository.updateConversationStatus).toHaveBeenCalled();
    });

    it('should return the default message when the index is out of bounds', async () => {
        // Given
        // Simulate a scenario where there are more outbound messages than the conversationConfiguration covers
        const mockMessages: Message[] = new Array(5).fill({ direction: MessageDirection.OUTBOUND, content: 'Message', timestamp: new Date() });
        MessageRepository.getMessagesForConversation.mockResolvedValueOnce(mockMessages);

        // When
        const response = await generateNextResponse('conversationId3');

        // Then
        expect(response).toBe('Default message'); // Assuming you implemented the suggested default message handling
        expect(MessageRepository.getMessagesForConversation).toHaveBeenCalledWith('conversationId3');
        expect(ConversationRepository.updateConversationStatus).toHaveBeenCalled();
    });

    it('should handle errors gracefully when fetching messages fails', async () => {
        // Given
        // Simulate a failure in fetching messages
        MessageRepository.getMessagesForConversation.mockRejectedValueOnce(new Error('Database error'));

        // When/Then
        await expect(generateNextResponse('conversationId4')).rejects.toThrow('Database error');
        expect(ConversationRepository.updateConversationStatus).not.toHaveBeenCalled();
    });
});
