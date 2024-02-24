import { beforeAll, describe, expect, it, vi } from 'vitest';
import * as MessageRepository from '../../src/db/repositories/MessageRepository';
import { generateNextResponse } from '../../src/conversations/responseGenerator';
import { Message } from '../../src/db/types/public/Message';
import { MessageDirection } from '../../src/conversations/enums/MessageDirection';
import * as ConversationRepository from "../../src/db/repositories/ConversationRepository";

vi.mock('../../src/db/repositories/MessageRepository', () => ({
    getMessagesForConversation: vi.fn(),
}));

vi.mock('../../src/db/repositories/ConversationRepository', () => ({
    updateConversationStatus: vi.fn(),
}));

describe('generateNextResponse', () => {
    it('should generate the first response if no messages are found', async () => {
        MessageRepository.getMessagesForConversation.mockResolvedValueOnce([]);

        const response = await generateNextResponse('conversationId1');
        expect(response).toBe('First Message');
        expect(MessageRepository.getMessagesForConversation).toHaveBeenCalledWith('conversationId1');
        expect(ConversationRepository.updateConversationStatus).not.toHaveBeenCalled();
    });

    it('should generate the correct response based on the number of outbound messages', async () => {
        // Simulate a scenario where there are two outbound messages
        const mockMessages: Message[] = [
            { direction: MessageDirection.OUTBOUND, content: 'Hello', timestamp: new Date() },
            { direction: MessageDirection.OUTBOUND, content: 'How are you?', timestamp: new Date() },
        ];
        MessageRepository.getMessagesForConversation.mockResolvedValueOnce(mockMessages);

        const response = await generateNextResponse('conversationId2');
        expect(response).toBe('Third Message');
        expect(MessageRepository.getMessagesForConversation).toHaveBeenCalledWith('conversationId2');
        expect(ConversationRepository.updateConversationStatus).toHaveBeenCalled();
    });

    it('should return the default message when the index is out of bounds', async () => {
        // Simulate a scenario where there are more outbound messages than the conversationConfiguration covers
        const mockMessages: Message[] = new Array(5).fill({ direction: MessageDirection.OUTBOUND, content: 'Message', timestamp: new Date() });
        MessageRepository.getMessagesForConversation.mockResolvedValueOnce(mockMessages);

        const response = await generateNextResponse('conversationId3');
        expect(response).toBe('Default message'); // Assuming you implemented the suggested default message handling
        expect(MessageRepository.getMessagesForConversation).toHaveBeenCalledWith('conversationId3');
        expect(ConversationRepository.updateConversationStatus).toHaveBeenCalled();
    });

    it('should handle errors gracefully when fetching messages fails', async () => {
        // Simulate a failure in fetching messages
        MessageRepository.getMessagesForConversation.mockRejectedValueOnce(new Error('Database error'));

        await expect(generateNextResponse('conversationId4')).rejects.toThrow('Database error');
        expect(ConversationRepository.updateConversationStatus).not.toHaveBeenCalled();
    });

    // Add more tests as needed to cover all scenarios and edge cases
});
