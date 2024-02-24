import {describe, expect, it} from "vitest";
import {decodeBase64String, decodeEventBody, getParams} from "../../../src/conversations/utils/base64Decoder";
import {
    simpleTextTwilioWebhookEventApple
} from "@rest-api/functions/test/resources/twilioWebhookEvents/devices/apple/basic_text_message_webhook_event_APPLE";
import {
    singleTenSecondVideoTwilioEventApple
} from "@rest-api/functions/test/resources/twilioWebhookEvents/devices/apple/text_message_with_single_10_second_video_webhook_event_APPLE";
import {
    singleImageTwilioEventAndroid
} from "@rest-api/functions/test/resources/twilioWebhookEvents/devices/android/text_message_with_single_image_webhook_event_ANDROID";
import {
    singleImageTwilioWebhookEventApple as singleImageTwilioWebhookEventApple
} from "@rest-api/functions/test/resources/twilioWebhookEvents/devices/apple/text_message_with_single_image_webhook_event_APPLE";
import {
    textMessageWithSingleVideoWebhookEventAndroid
} from "@rest-api/functions/test/resources/twilioWebhookEvents/devices/android/text_message_with_single_video_webhook_event_ANDROID";

describe('Base64 decoder', () => {
    it('should decode a base64 string', async () => {
        // Given
        const base64String = 'SGVsbG8gV29ybGQ=';

        // When
        const decodedString = await decodeBase64String(base64String);

        // Then
        expect(decodedString).toBe('Hello World');
    });

    it('should decode the event body', async () => {
        // Given
        const event = {
            body: 'SGVsbG8gV29ybGQ='
        };

        // When
        const decodedEvent = await decodeEventBody(event);

        // Then
        expect(decodedEvent).toBe('Hello World');
    })

    it('should get the params from a simple text (text only without any media) event apple', async () => {
        // When
        const params = await getParams(simpleTextTwilioWebhookEventApple);

        // Then
        expect(params).toEqual({
            "accountPhoneNumber": "+18017916516",
            "mediaContentType": null,
            "mediaUrl": null,
            "message": "Text 12 12:20pm",
            "numMedia": "0",
            "recipientPhoneNumber": "+18446151430",
        });
    });

    it('should get the params from a text with a single video event apple', async () => {
        // When
        const params = await getParams(singleTenSecondVideoTwilioEventApple);

        // Then
        expect(params).toEqual({
            "accountPhoneNumber": "+18017916516",
            "mediaContentType": "video/3gpp",
            "mediaUrl": "https://api.twilio.com/2010-04-01/Accounts/ACb2722d11b73d22b594c81d79aed6b8d2/Messages/MMf3aec14a0afd453f9b8809032b043ad0/Media/ME4daf2ae187fcf9e29503f1d6b25b78ce",
            "message": "",
            "numMedia": "1",
            "recipientPhoneNumber": "+18446151430",
        });
    });

    it('should get the params from a text with a single image event apple', async () => {
        // When
        const params = await getParams(singleImageTwilioWebhookEventApple);

        // Then
        expect(params).toEqual({
            "accountPhoneNumber": "+18017916516",
            "mediaContentType": "image/jpeg",
            "mediaUrl": "https://api.twilio.com/2010-04-01/Accounts/ACb2722d11b73d22b594c81d79aed6b8d2/Messages/MM3934ada51e7a20b35b4dd6c7635a29d2/Media/MEff408942d874d4301caea243989659ea",
            "message": "",
            "numMedia": "1",
            "recipientPhoneNumber": "+18446151430",
        });
    });

    it('should get the params from a text with a single image event android', async () => {
        // When
        const params = await getParams(singleImageTwilioEventAndroid);

        // Then
        expect(params).toEqual({
            "accountPhoneNumber": "+19168720460",
            "mediaContentType": "image/jpeg",
            "mediaUrl": "https://api.twilio.com/2010-04-01/Accounts/ACb2722d11b73d22b594c81d79aed6b8d2/Messages/MM85dccca958f9d8c4dab65626b75a6956/Media/ME778831dab35c2a2e46ea96de7d6cc361",
            "message": "",
            "numMedia": "1",
            "recipientPhoneNumber": "+18446151430",
        });
    });

    it('should get the params from a text with a single video event android', async () => {
        // When
        const params = await getParams(textMessageWithSingleVideoWebhookEventAndroid);

        // Then
        expect(params).toEqual({
            "accountPhoneNumber": "+19168720460",
            "mediaContentType": "video/3gpp",
            //           https://api.twilio.com/2010-04-01/Accounts/ACb2722d11b73d22b594c81d79aed6b8d2/Messages/MMf3aec14a0afd453f9b8809032b043ad0/Media/ME4daf2ae187fcf9e29503f1d6b25b78ce
            "mediaUrl": "https://api.twilio.com/2010-04-01/Accounts/ACb2722d11b73d22b594c81d79aed6b8d2/Messages/MMc77c5b58b354486f9a324b02b86ec702/Media/ME9865dd22dff6f1f8d9f29a61895fb165",
            "message": "",
            "numMedia": "1",
            "recipientPhoneNumber": "+18446151430",
        });
    });
});
