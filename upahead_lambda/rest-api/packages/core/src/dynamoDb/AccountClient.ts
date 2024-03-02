import {ContentTypes} from "../conversations/enums/ContentTypes";
import {PhoneNumberValidator} from "../conversations/utils/PhoneNumberValidator";

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
        const validatedPhoneNumber = PhoneNumberValidator.validatePhoneNumber(phoneNumber);
        console.log("Looking for account with internal phone number", validatedPhoneNumber);
        return this.accounts.find(account => account.internalPhoneNumber === validatedPhoneNumber) || null;
    }
}

export interface Account {
    accountId: string;
    accountName: string;
    internalPhoneNumber: string;
    conversationConfiguration: ConversationConfiguration;
}

export interface ConversationConfiguration {
    firstMessage: string;
    expectedResponseType: ContentTypes;
    lastMessage: string;
    accountId: string;
}