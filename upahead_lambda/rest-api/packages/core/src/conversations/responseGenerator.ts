import {getConversationById} from "../db/repositories/ConversationRepository";

export async function generateNextResponse(conversationId: string) {
    const conversation = await getConversationById(conversationId);
    console.log("Got conversation from Id to generate response", conversation);
}