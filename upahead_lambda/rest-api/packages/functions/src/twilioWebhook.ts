import {handleIncomingMessage} from "@rest-api/core/conversations/conversationManager";
import {getParams} from "@rest-api/core/conversations/utils/base64Decoder";
import {TwilioClient} from "@rest-api/core/clients/_TwilioClient";

const {MessagingResponse} = require("twilio").twiml;

const twilioClient: TwilioClient = new TwilioClient();
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
        const response = await twilioClient.sendTwilioMessage(
            nextMessage,
            incomingMessageParams.recipientPhoneNumber,
            incomingMessageParams.accountPhoneNumber
        );
        console.log(response);
    } catch (error) {
        console.error(error);
    }

}
