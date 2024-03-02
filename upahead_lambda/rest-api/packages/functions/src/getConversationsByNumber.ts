import {getConversationsByAccountPhoneNumber} from "@rest-api/core/db/repositories/ConversationRepository";

export const handler = async (event: any) => {
    // Log the incoming event to see its structure (useful for debugging)
    console.log("Get Conversations By Number: \n", event);

    // Extract query parameters from the event
    const queryParams = event.queryStringParameters;
    console.log("Query Parameters: \n", queryParams);
    const accountPhoneNumber = queryParams?.accountPhoneNumber;
    const utcDate = queryParams?.utc;

    // Check if both accountPhoneNumber and utcDate are provided
    if (!accountPhoneNumber || !utcDate) {
        return {
            statusCode: 400, // Bad Request
            body: JSON.stringify({
                message: "Missing accountPhoneNumber or utc date in query parameters",
            }),
        };
    }

    const conversations = await getConversationsByAccountPhoneNumber(accountPhoneNumber, utcDate);
    // Example response
    return {
        statusCode: 200, // OK
        body: JSON.stringify({
            message: "Successfully retrieved conversations",
            accountPhoneNumber: accountPhoneNumber,
            utcDate: utcDate,
            conversations: conversations, // Assuming you add logic to retrieve and return conversations
        }),
    };
};