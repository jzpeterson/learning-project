import {describe, expect, it} from "vitest";
import {
    createConversation,
    deleteConversation,
    getConversationById,
    selectActiveConversationsBetweenAccountAndRecipient,
    updateConversationStatus, updateConversationStatusByRecipientAndAccountPhoneNumber
} from "../../src/db/repositories/ConversationRepository";
import {ConversationStatus} from "../../src/conversations/enums/ConversationStatus";
import {randomUUID} from "node:crypto";

export async function createConversationForTest(recipient_phone_number: string,
                                                account_phone_number: string,
                                                status: ConversationStatus): Promise<any> {
    const conversation = {
        'recipient_phone_number': recipient_phone_number,
        'account_phone_number': account_phone_number,
        'last_update_time': new Date(),
        'status': status
    };

    return await createConversation(conversation);
}

describe('Test Conversations Repository', () => {
    const recipient_phone_number = '8017916516';
    const account_phone_number = '1111111111';
    const status = ConversationStatus.ACTIVE;

    it('should create a conversation', async () => {
        const conversation = {
            'recipient_phone_number': '123',
            'account_phone_number': '456',
            'last_update_time': new Date(),
            'status': ConversationStatus.ACTIVE
        };
        const result = await createConversation(conversation);
        expect(result.start_time).toBeDefined();
        expect(result.id).toBeDefined();
        expect(result.account_phone_number).toBe('456');
        expect(result.recipient_phone_number).toBe('123');
        expect(result.last_update_time).toBeDefined();
        expect(result.status).toBe(ConversationStatus.ACTIVE);
    });

    it('should find all active conversations between an account and recipient', async () => {
        // given
        await createConversationForTest(recipient_phone_number, account_phone_number, status)
        // when
        const active_conversations =
            await selectActiveConversationsBetweenAccountAndRecipient(recipient_phone_number, account_phone_number)
        console.log(active_conversations);

        // then
        expect(active_conversations).toBeDefined();
        expect(active_conversations.length).toBeGreaterThan(0);

        for (const item of active_conversations) {
            expect(item.account_phone_number).toBe(account_phone_number);
            expect(item.recipient_phone_number).toBe(recipient_phone_number);
            expect(item.status).toBe(ConversationStatus.ACTIVE);
        }
    });

    it('Should delete a conversation by id', async () => {
        // given
        const conversationToDelete = await createConversationForTest(recipient_phone_number, account_phone_number, status)

        // when
        const deleted_conversation = await deleteConversation(conversationToDelete.id);

        // then
        console.log(deleted_conversation);
        expect(deleted_conversation.length).toBe(1);
    });

    it('should update a conversation status', async () => {
        // Given
        const conversationToUpdate = await createConversationForTest(recipient_phone_number, account_phone_number, ConversationStatus.ACTIVE);

        // When
        await updateConversationStatus(conversationToUpdate.id, ConversationStatus.TERMINATED_INCOMPLETE);

        // Then
        const updatedConversation = await getConversationById(conversationToUpdate.id);
        expect(updatedConversation.status).toBe(ConversationStatus.TERMINATED_INCOMPLETE);
    });

    it('should update all conversations between an account and recipient', async () => {
        // Given
        const uniqueRecipientPhoneNumber = randomUUID();
        await createConversationForTest(uniqueRecipientPhoneNumber, account_phone_number, ConversationStatus.ACTIVE);
        await createConversationForTest(uniqueRecipientPhoneNumber, account_phone_number, ConversationStatus.ACTIVE);

        // When
        await updateConversationStatusByRecipientAndAccountPhoneNumber(uniqueRecipientPhoneNumber, account_phone_number, ConversationStatus.TERMINATED_INCOMPLETE);

        // Then
        const updatedConversations = await selectActiveConversationsBetweenAccountAndRecipient(uniqueRecipientPhoneNumber, account_phone_number);
        for (const item of updatedConversations) {
            expect(item.status).toBe(ConversationStatus.TERMINATED_INCOMPLETE);
        }
    });
});
