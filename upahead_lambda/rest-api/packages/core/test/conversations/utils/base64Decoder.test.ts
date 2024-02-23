import {describe, expect, it} from "vitest";
import {decodeBase64String, decodeEventBody, getParams} from "../../../src/conversations/utils/base64Decoder";

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

    it('should get the params from the event', async () => {
        // Given
        const event = {
            body: 'VG9Db3VudHJ5PVVTJlRvU3RhdGU9JlNtc01lc3NhZ2VTaWQ9U001MDU5M2VjNmY4YTRhOTY1NjNkOWQ2ODE3YTkwYzQyZiZOdW1NZWRpYT0wJlRvQ2l0eT0mRnJvbVppcD04NDA1MCZTbXNTaWQ9U001MDU5M2VjNmY4YTRhOTY1NjNkOWQ2ODE3YTkwYzQyZiZGcm9tU3RhdGU9VVQmU21zU3RhdHVzPXJlY2VpdmVkJkZyb21DaXR5PU9HREVOJkJvZHk9VGV4dCsxMisxMiUzQTIwcG0mRnJvbUNvdW50cnk9VVMmVG89JTJCMTg0NDYxNTE0MzAmTWVzc2FnaW5nU2VydmljZVNpZD1NR2I0MDhmZTRhOTY4ODc1ZGZmZTBiODAwZDA4Y2Q2Mzc4JlRvWmlwPSZOdW1TZWdtZW50cz0xJk1lc3NhZ2VTaWQ9U001MDU5M2VjNmY4YTRhOTY1NjNkOWQ2ODE3YTkwYzQyZiZBY2NvdW50U2lkPUFDYjI3MjJkMTFiNzNkMjJiNTk0YzgxZDc5YWVkNmI4ZDImRnJvbT0lMkIxODAxNzkxNjUxNiZBcGlWZXJzaW9uPTIwMTAtMDQtMDE=',
        };

        // When
        const params = await getParams(event);

        // Then
        expect(params).toEqual({
            recipientPhoneNumber: "+18446151430",
            accountPhoneNumber: "+18017916516",
            message: "Text 12 12:20pm"
        });
    });
});
