import {handleIncomingMessage} from "@rest-api/core/conversations/conversationManager";
import {sendTwilioMessage} from "@rest-api/core/clients/twilioClient";
import {getParams} from "@rest-api/core/conversations/utils/base64Decoder";

const {MessagingResponse} = require("twilio").twiml;

export const handler = async (event: any) => {
    console.log('Node.js version:', process.version);
    console.log("Twilio Event Received: \n", event);

    const incomingMessageParams = await getParams(event)

    const nextMessage = await handleIncomingMessage(event)

    console.log("Next Message Identified:", nextMessage)

    const twiml = new MessagingResponse();
    const message = twiml.message();
    message.body(nextMessage);

    try {
        const response = await sendTwilioMessage(
            nextMessage,
            incomingMessageParams.recipientPhoneNumber,
            incomingMessageParams.accountPhoneNumber
        );
        console.log(response);
    } catch (error) {
        console.error(error);
    }

}
