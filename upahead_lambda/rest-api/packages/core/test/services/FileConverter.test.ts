import {beforeEach, describe, it} from "vitest";
import {ConverterService} from "../../src/services/FileConverter";
import {ListBucketsCommand, S3Client} from "@aws-sdk/client-s3";

describe('FileConverter', () => {
    let converterService: ConverterService;
    beforeEach(() => {
        converterService = new ConverterService();
    });

    it('test_uploading_stuff', async () => {
        // Given
        // When
        const result = await converterService.convertAndUpload('https://api.twilio.com/2010-04-01/Accounts/ACb2722d11b73d22b594c81d79aed6b8d2/Messages/MMd4da5274976e6f83d9164e68c2bcef76/Media/ME1923e434618f315788eb5d0ba75efb41', 'test-key-prefix', 'test.mp4');
        console.log(result);
        // Then
    }, {
        timeout: 1000000 // Timeout in milliseconds (e.g., 10000ms = 10 seconds)
    });
//     it('test S3 Bucket', async () => {
//
//
// // When no region or credentials are provided, the SDK will use the
// // region and credentials from the local AWS config.
//         const client = new S3Client({});
//
//         const command = new ListBucketsCommand({});
//
//         const {Buckets} = await client.send(command);
//         console.log("Buckets: ");
//         console.log(Buckets.map((bucket) => bucket.Name).join("\n"));
//         return Buckets;
//
//
//     });
});
