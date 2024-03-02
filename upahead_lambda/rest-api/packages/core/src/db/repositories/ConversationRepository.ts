import {ConversationStatus} from "../../conversations/enums/ConversationStatus";
import {NewConversation} from "../types/public/Conversation";
import {prodDB} from "../postgresConversationsDB";

const db = prodDB

export async function getConversationById(id: string) {
    console.log("Getting conversation by id", id)
    return await db
        .selectFrom("Conversation")
        .selectAll()
        .where("Conversation.id", "=", id)
        .executeTakeFirst();
}

export async function createConversation(conversation: NewConversation) {
    console.log("Creating conversation", conversation)
    return await db.insertInto('Conversation')
        .values(conversation)
        .returningAll()
        .executeTakeFirstOrThrow()
}

export async function selectActiveConversationsBetweenAccountAndRecipient(recipientPhoneNumber: string, accountPhoneNumber: string) {
    console.log("Selecting active conversations between", recipientPhoneNumber, "and", accountPhoneNumber)
    return await db
        .selectFrom("Conversation")
        .selectAll()
        .where("Conversation.account_phone_number", "=", accountPhoneNumber)
        .where("Conversation.recipient_phone_number", "=", recipientPhoneNumber)
        .where("Conversation.status", "=", ConversationStatus.ACTIVE)
        .execute();
}

export async function deleteConversation(id: string) {
    console.log("Deleting conversation by id", id)
    return await db
        .deleteFrom("Conversation")
        .where("Conversation.id", "=", id)
        .execute();
}

export async function updateConversationStatus(id: string, status: ConversationStatus) {
    console.log("Updating conversation status by id", id, status)
    return await db
        .updateTable("Conversation")
        .set({"status": status})
        .where("Conversation.id", "=", id)
        .executeTakeFirst();
}

export async function updateConversationStatusByRecipientAndAccountPhoneNumber(recipientPhoneNumber: string,
                                                                               accountPhoneNumber: string, status: ConversationStatus) {
    console.log("Updating conversation status by recipient and account phone number",
        recipientPhoneNumber, accountPhoneNumber, status)
    return await db
        .updateTable("Conversation")
        .set({"status": status})
        .where("Conversation.account_phone_number", "=", accountPhoneNumber)
        .where("Conversation.recipient_phone_number", "=", recipientPhoneNumber)
        .execute();
}


export async function getConversationsByAccountPhoneNumber(accountPhoneNumber: string) {
    console.log("Getting conversations by account phone number", accountPhoneNumber)
    return await db
        .selectFrom("Conversation")
        .selectAll()
        .where("Conversation.recipient_phone_number", "=", accountPhoneNumber)
        .innerJoin("Message", "Conversation.id", "Message.conversation_id")
        .execute();
}