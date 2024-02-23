import {Message} from "../types/public/Message";
import {prodDB} from "../postgresConversationsDB";


const db = prodDB;

export async function addMessageToConversation(conversationId: string, message: Message) {
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
    return await db
        .selectFrom('Message')
        .selectAll()
        .where('conversation_id', '=', conversationId)
        .execute()
}