
export enum MessageDirection {
    INBOUND = "INBOUND",
    OUTBOUND = "OUTBOUND"
}

export function getMessageDirectionFromString(messageDirectionString: string): MessageDirection {
    const messageDirection:MessageDirection = MessageDirection[messageDirectionString.toUpperCase() as keyof typeof MessageDirection];

    if (!messageDirection) {
        throw new Error("Invalid message direction: " + messageDirectionString);
    }

    return messageDirection;
}