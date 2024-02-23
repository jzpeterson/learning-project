import {handle_incoming_mesage} from "@rest-api/core/conversations/conversationManager";

const {MessagingResponse} = require("twilio").twiml;

export const handler = async (event: any) => {
    console.log("Twilio Event Received: \n", event);
    const nextMessage = await handle_incoming_mesage(event)

    const twiml = new MessagingResponse();

    const message = twiml.message();
    message.body(nextMessage);

    return {
        statusCode: 200,
        headers: {"Content-Type": "text/xml"},
        body: twiml.toString(),
    };
}
