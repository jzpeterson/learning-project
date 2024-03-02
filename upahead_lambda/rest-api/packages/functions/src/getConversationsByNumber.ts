import {retrieveConversationsByNumber} from "@rest-api/core/conversations/conversationManager";

export const handler = async (event: any) => {
    console.log("Get Conversations By Number: \n", event);

    const queryParams = event.queryStringParameters;
    console.log("Query Parameters: \n", queryParams);
    const internalPhoneNumber = queryParams?.internalPhoneNumber;

    if (!internalPhoneNumber) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Missing internalPhoneNumber in query parameters",
            }),
        };
    }

    const conversations = await retrieveConversationsByNumber(internalPhoneNumber);

    return {
        statusCode: 200,
        body: JSON.stringify({
            conversations: conversations,
        }),
    };
};