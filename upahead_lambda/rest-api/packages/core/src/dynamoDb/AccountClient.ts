import {ConversationConfiguration} from "../conversations/models/_Conversation";
import {ContentTypes} from "../conversations/enums/ContentTypes";

export class AccountClient {
    private accounts: Account[] = [
        {
            accountId: "1",
            accountName: "Testing Account",
            internalPhoneNumber: "+18446151430",
            conversationConfiguration: {
                firstMessage: "Hello, please send us a short video message about why upahead is awesome.",
                expectedResponseType: ContentTypes.VIDEO,
                lastMessage: "Thanks for the video! We'll be in touch soon.",
                accountId: "1"
            }
        }
    ];

    public async getAccountByPhoneNumber(phoneNumber: string): Promise<Account | null> {
        return this.accounts.find(account => account.internalPhoneNumber === phoneNumber) || null;
    }


}

export interface Account {
    accountId: string;
    accountName: string;
    internalPhoneNumber: string;
    conversationConfiguration: ConversationConfiguration;
}