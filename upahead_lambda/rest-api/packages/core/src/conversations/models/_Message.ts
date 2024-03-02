import { ContentTypes } from "../enums/ContentTypes";
import { MessageDirection } from "../enums/MessageDirection";

export interface Message {
    contentType: ContentTypes,
    messageDirection: MessageDirection,
    content: string
    internalPhoneNumber: string,
    externalPhoneNumber: string,
    timestamp: Date,
    originalJsonPayload: string | null,
}