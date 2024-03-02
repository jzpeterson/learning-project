export enum ConversationStatus {
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    TERMINATED_INCOMPLETE = "TERMINATED_INCOMPLETE",
}

export function getConversationStatusFromString(statusString: string): ConversationStatus {
    const status:ConversationStatus = ConversationStatus[statusString.toUpperCase() as keyof typeof ConversationStatus];

    if (!status) {
        throw new Error("Invalid conversation status: " + statusString);
    }

    return status;
}