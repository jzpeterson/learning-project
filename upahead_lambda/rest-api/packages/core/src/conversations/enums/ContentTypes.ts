import {ConversationStatus} from "./ConversationStatus";

export enum ContentTypes {
    TEXT = "TEXT",
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    AUDIO = "AUDIO",
}

export function getContentTypeFromString(statusString: string): ContentTypes {
    const contentType:ContentTypes = ContentTypes[statusString.toUpperCase() as keyof typeof ContentTypes];

    // if (!contentType) {
    //     throw new Error("Invalid conversation contentType: " + statusString);
    // }

    return contentType;
}