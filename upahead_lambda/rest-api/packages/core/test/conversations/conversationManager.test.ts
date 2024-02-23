import {beforeAll, describe, expect, it, vi} from "vitest";
import * as ConversationRepository from "../../src/db/repositories/ConversationRepository";
import * as MessageRepository from "../../src/db/repositories/MessageRepository";
import * as twilioClient from "../../src/clients/twilioClient";
import {initiateConversation} from "../../src/conversations/conversationManager";
import {ConversationStatus} from "../../src/conversations/enums/ConversationStatus";

describe('Test Conversation Manager', () => {
    const accountPhoneNumber = '8017916516';
    const recipientPhoneNumber = '1111111111';
    const conversationId = '12343123123';
    const status = ConversationStatus.ACTIVE;
    const startTime = new Date();
    const lastUpdateTime = new Date();
    beforeAll(() => {
        vi.mock('../../src/db/repositories/ConversationRepository', () => ({
            createConversation: vi.fn(() => Promise.resolve({
                id: '12343123123',
            })),
            updateConversationStatusByRecipientAndAccountPhoneNumber: vi.fn(() => Promise.resolve({/* mock result */})),
        }));
        vi.mock('../../src/db/repositories/MessageRepository', () => ({
            addMessageToConversation: vi.fn(() => Promise.resolve({/* mock result */})),
        }));
        vi.mock('../../src/clients/twilioClient', () => ({
            sendTwilioMessage: vi.fn(() => Promise.resolve({
                "body": "Hello from Twilio",
                "numSegments": "1",
                "direction": "outbound-api",
                "from": "+18446151430",
                "to": "+18017916516",
                "dateUpdated": "2024-02-23T00:19:52.000Z",
                "price": null,
                "errorMessage": null,
                "uri": "/2010-04-01/Accounts/ACb2722d11b73d22b594c81d79aed6b8d2/Messages/SM665ad35078f1678b75ea343a357f32d5.json",
                "accountSid": "ACb2722d11b73d22b594c81d79aed6b8d2",
                "numMedia": "0",
                "status": "queued",
                "messagingServiceSid": null,
                "sid": "SM665ad35078f1678b75ea343a357f32d5",
                "dateSent": null,
                "dateCreated": "2024-02-23T00:19:52.000Z",
                "errorCode": null,
                "priceUnit": "USD",
                "apiVersion": "2010-04-01",
                "subresourceUris": {
                    "media": "/2010-04-01/Accounts/ACb2722d11b73d22b594c81d79aed6b8d2/Messages/SM665ad35078f1678b75ea343a357f32d5/Media.json"
                }
            })),
        }));
    });
    it('should deactivate previous conversation then create a conversation', async () => {
        // Given


        // When
        await initiateConversation(accountPhoneNumber, recipientPhoneNumber);

        // Then
        expect(ConversationRepository.updateConversationStatusByRecipientAndAccountPhoneNumber).toHaveBeenCalledOnce();
        expect(ConversationRepository.updateConversationStatusByRecipientAndAccountPhoneNumber)
            .toHaveBeenCalledWith(recipientPhoneNumber, accountPhoneNumber, ConversationStatus.TERMINATED_INCOMPLETE)

        expect(ConversationRepository.createConversation).toHaveBeenCalledTimes(1);
        expect(ConversationRepository.createConversation).toHaveBeenCalledWith({
            recipient_phone_number: recipientPhoneNumber,
            account_phone_number: accountPhoneNumber,
            last_update_time: expect.any(Date),
            status: ConversationStatus.ACTIVE
        });

        expect(twilioClient.sendTwilioMessage).toHaveBeenCalledOnce();
        expect(twilioClient.sendTwilioMessage).toHaveBeenCalledWith("Hey", accountPhoneNumber, recipientPhoneNumber);

        expect(MessageRepository.addMessageToConversation).toHaveBeenCalledTimes(1);
        expect(MessageRepository.addMessageToConversation).toHaveBeenCalledWith(
            conversationId,
            {
                direction: "OUTBOUND",
                content_type: "text",
                content: "Hey"
            }
        );

    });
});
