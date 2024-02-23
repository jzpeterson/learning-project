import {ConversationStatus} from "../../conversations/enums/ConversationStatus";
import {NewConversation} from "../types/public/Conversation";
import {prodDB} from "../postgresConversationsDB";

const db = prodDB

export async function getConversationById(id: string) {
    return await db
        .selectFrom("Conversation")
        .selectAll()
        .where("Conversation.id", "=", id)
        .executeTakeFirst();
}

export async function createConversation(conversation: NewConversation) {
    return await db.insertInto('Conversation')
        .values(conversation)
        .returningAll()
        .executeTakeFirstOrThrow()
}

export async function selectActiveConversationsBetweenaccountAndRecipient(recipientPhoneNumber: string, accountPhoneNumber: string) {
    return await db
        .selectFrom("Conversation")
        .selectAll()
        .where("Conversation.account_phone_number", "=", accountPhoneNumber)
        .where("Conversation.recipient_phone_number", "=", recipientPhoneNumber)
        .where("Conversation.status", "=", ConversationStatus.ACTIVE)
        .execute();
}

export async function deleteConversation(id: string) {
    return await db
        .deleteFrom("Conversation")
        .where("Conversation.id", "=", id)
        .execute();
}

export async function updateConversationStatus(id: string, status: ConversationStatus) {
    return await db
        .updateTable("Conversation")
        .set({"status": status})
        .where("Conversation.id", "=", id)
        .executeTakeFirst();
}

export async function updateConversationStatusByRecipientAndAccountPhoneNumber(recipientPhoneNumber: string, accountPhoneNumber: string, status: ConversationStatus) {
    return await db
        .updateTable("Conversation")
        .set({"status": status})
        .where("Conversation.account_phone_number", "=", accountPhoneNumber)
        .where("Conversation.recipient_phone_number", "=", recipientPhoneNumber)
        .execute();
}
