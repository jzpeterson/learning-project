const {MessagingResponse} = require("twilio").twiml;

export const handler = async (event: any) => {
    console.log("Twilio Event Received: \n", event);
    // Save response to the DB #TODO

    // Generate Twilio Response

    const twiml = new MessagingResponse();

    const message = twiml.message();
    message.body("Check if the twilio response is working");

    return {
        statusCode: 200,
        headers: {"Content-Type": "text/xml"},
        body: twiml.toString(),
    };
}
