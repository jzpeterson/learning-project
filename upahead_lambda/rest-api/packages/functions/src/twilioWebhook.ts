import {handleIncomingMessage} from "@rest-api/core/conversations/conversationManager";
import {TwilioClient} from "@rest-api/core/clients/TwilioClient";
import {ExternalMessageParamDecoder} from "@rest-api/core/conversations/utils/ExternalMessageParamDecoder";
import {tryToDoTheThing} from "@rest-api/core/dynamoDb/ConversationsClient";

const {MessagingResponse} = require("twilio").twiml;

const twilioClient: TwilioClient = new TwilioClient();
const externalMessageParamDecoder: ExternalMessageParamDecoder = new ExternalMessageParamDecoder();
export const handler = async (event: any) => {
    await tryToDoTheThing()
    console.log('Node.js version:', process.version);
    console.log("Twilio Event Received: \n", event);

    const incomingMessageParams = await externalMessageParamDecoder.getParams(event)

    const nextMessage = await handleIncomingMessage(event)

    console.log("Next Message Identified:", nextMessage)

    const twiml = new MessagingResponse();
    const message = twiml.message();
    message.body(nextMessage);

    try {
        const response = await twilioClient.sendTwilioMessage(
            nextMessage,
            incomingMessageParams.internalPhoneNumber,
            incomingMessageParams.externalPhoneNumber
        );
        console.log(response);
    } catch (error) {
        console.error(error);
    }

}
