import {initiateConversation} from "@rest-api/core/conversations/conversationManager";
import {PhoneNumberValidator} from "@rest-api/core/conversations/utils/PhoneNumberValidator";

export const handler = async (event: any) => {
    console.log("Trigger Outbound Conversation: \n", event);

    const body = JSON.parse(event.body);
    console.log("Body: \n", body);
    const externalPhoneNumber = body?.externalPhoneNumber;
    const internalPhoneNumber = body?.internalPhoneNumber;

    if (!externalPhoneNumber || !internalPhoneNumber) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Missing properties in request body" +
                    "externalPhoneNumber: " + externalPhoneNumber +
                    "internalPhoneNumber: " + internalPhoneNumber,
            }),
        };
    }
    try {
        await initiateConversation(PhoneNumberValidator.validatePhoneNumber(internalPhoneNumber),
            PhoneNumberValidator.validatePhoneNumber(externalPhoneNumber));
    } catch (e) {
        console.error("Error initiating conversation", e)
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: e,
            }),
        };
    }
    return {
        statusCode: 200,
    };
}