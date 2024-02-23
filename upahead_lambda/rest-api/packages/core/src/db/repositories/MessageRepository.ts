import {Message} from "../types/public/Message";
import {prodDB} from "../postgresConversationsDB";


const db = prodDB;

export async function addMessageToConversation(conversationId: string, message: Message) {
    console.log("Adding message to conversation", conversationId, message)
    return await db
        .insertInto('Message')
        .values({
            conversation_id: conversationId,
            direction: message.direction,
            content_type: message.content_type,
            content: message.content
        })
        .returningAll()
        .executeTakeFirstOrThrow()
}

export async function getMessagesForConversation(conversationId: string) {
    console.log("Getting messages for conversation", conversationId)
    return await db
        .selectFrom('Message')
        .selectAll()
        .where('conversation_id', '=', conversationId)
        .execute()
}