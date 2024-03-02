export interface ExternalMessageParams {
    externalPhoneNumber: string,
    internalPhoneNumber: string,
    message: string | null,
    mediaContentType: string | null,
    numMedia: string | null,
    mediaUrl: string | null,
    messageSid: string
}