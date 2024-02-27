import {handleIncomingMessage} from "@rest-api/core/conversations/conversationManager";

const {MessagingResponse} = require("twilio").twiml;

export const handler = async (event: any) => {
    console.log('Node.js version:', process.version);
    console.log("Twilio Event Received: \n", event);

    const nextMessage = await handleIncomingMessage(event)

    console.log("Next Message Identified:", nextMessage)

    const twiml = new MessagingResponse();
    const message = twiml.message();
    message.body(nextMessage);

    const response = {
        statusCode: 200,
        headers: {"Content-Type": "text/xml"},
        body: twiml.toString(),
    };
    console.log("Twilio Response: \n", response);
    return response;
}
