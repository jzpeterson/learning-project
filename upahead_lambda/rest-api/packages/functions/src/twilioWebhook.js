"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const conversationManager_1 = require("@rest-api/core/conversations/conversationManager");
const { MessagingResponse } = require("twilio").twiml;
const handler = async (event) => {
    console.log("Twilio Event Received: \n", event);
    const nextMessage = await (0, conversationManager_1.handleIncomingMessage)(event);
    const twiml = new MessagingResponse();
    const message = twiml.message();
    message.body(nextMessage);
    return {
        statusCode: 200,
        headers: { "Content-Type": "text/xml" },
        body: twiml.toString(),
    };
};
exports.handler = handler;
