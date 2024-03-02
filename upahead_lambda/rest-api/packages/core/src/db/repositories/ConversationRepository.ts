import {ConversationStatus} from "../../conversations/enums/ConversationStatus";
import {NewConversation} from "../types/public/Conversation";
import {prodDB} from "../postgresConversationsDB";

const db = prodDB

export async function getConversationById(id: string) {
    console.log("Getting conversation by ID", id);
    // First, fetch the conversations
    const conversation = await db
        .selectFrom("Conversation")
        .selectAll()
        .where("Conversation.id", "=", id)
        .executeTakeFirstOrThrow();
    console.log("Found conversation for id: " + id, conversation)

    // Then, fetch messages for those conversations
    const messages = await db
        .selectFrom("Message")
        .selectAll()
        .where("Message.conversation_id","=", conversation.id)
        .execute();

    console.log("Found Messages", messages.length, "for conversation", conversation)

    const conversationsWithMessages = {
        ...conversation,
        messages: messages,
    };

    console.log("Returning conversation with messages", conversationsWithMessages)

    return conversationsWithMessages;
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

export async function getConversationsByInternalPhoneNumber(internalPhoneNumber: string) {
    console.log("Getting conversations by internal phone number", internalPhoneNumber);
    // First, fetch the conversations
    const conversations = await db
        .selectFrom("Conversation")
        .selectAll()
        .where("Conversation.account_phone_number", "=", internalPhoneNumber)
        .execute();
    console.log("Found " + conversations.length + " conversations for internal phone number", internalPhoneNumber)
    if (conversations.length === 0) return [];


    // Then, fetch messages for those conversations
    const conversationIds = conversations.map((conv) => conv.id);
    const messages = await db
        .selectFrom("Message")
        .selectAll()
        .where("Message.conversation_id","in", conversationIds)
        .execute();

    console.log("Found Messages", messages.length, "for conversations", conversationIds)

    const conversationsWithMessages = conversations.map((conversation) => ({
        ...conversation,
        messages: messages.filter((message) => message.conversation_id === conversation.id),
    }));
    console.log("Returning conversations with messages", conversationsWithMessages)

    return conversationsWithMessages;
}

