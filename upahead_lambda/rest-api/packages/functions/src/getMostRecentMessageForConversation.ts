import {retrieveMostRecentMessage} from "@rest-api/core/conversations/conversationManager";
import {getContentTypeFromString} from "@rest-api/core/conversations/enums/ContentTypes";

export const handler = async (event: any) => {
    console.log("Get Conversations By Number: \n", event);

    const queryParams = event.queryStringParameters;
    console.log("Query Parameters: \n", queryParams);
    const internalPhoneNumber = queryParams?.internalPhoneNumber;
    const externalPhoneNumber = queryParams?.externalPhoneNumber;
    const messageType = queryParams?.messageType;

    if (!internalPhoneNumber) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Missing internalPhoneNumber in query parameters",
            }),
        };
    }

    if (!externalPhoneNumber) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Missing externalPhoneNumber in query parameters",
            }),
        };
    }

    if (!messageType) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Missing messageType in query parameters",
            }),
        };
    }
    const convertedMessageType = getContentTypeFromString(messageType);
    if (!convertedMessageType) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Invalid messageType in query parameters. Please use either VIDEO, TEXT, AUDIO or IMAGE" +
                    " as the messageType. You sent this value " + messageType,
            }),
        };
    }
    let mostRecentMessage;
    try {
        mostRecentMessage = await retrieveMostRecentMessage(internalPhoneNumber,
            externalPhoneNumber,
            messageType);
    } catch (e) {
        mostRecentMessage = {
            content: `No ${convertedMessageType} messages found for the given numbers.
            internalPhoneNumber: ${internalPhoneNumber}, externalPhoneNumber: ${externalPhoneNumber}`,
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify(mostRecentMessage),
    };
};