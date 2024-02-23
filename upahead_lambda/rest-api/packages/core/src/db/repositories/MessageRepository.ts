import {testDB} from "../../../test/db/test_postgresConversationsDB";
import {Message} from "../types/public/Message";


const db = testDB;

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