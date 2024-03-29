import {handleIncomingMessage} from "@rest-api/core/conversations/conversationManager";
import {TwilioClient} from "@rest-api/core/clients/TwilioClient";
import {ExternalMessageParamDecoder} from "@rest-api/core/conversations/utils/ExternalMessageParamDecoder";

const twilioClient: TwilioClient = new TwilioClient();
const externalMessageParamDecoder: ExternalMessageParamDecoder = new ExternalMessageParamDecoder();
export const handler = async (event: any) => {
    console.log('Node.js version:', process.version);
    console.log("Twilio Event Received: \n", event);

    const incomingMessageParams = await externalMessageParamDecoder.getParams(event)

    const nextMessage = await handleIncomingMessage(event)

    console.log("Next Message Identified:", nextMessage)

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
