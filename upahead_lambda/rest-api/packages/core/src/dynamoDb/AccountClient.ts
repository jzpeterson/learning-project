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
        },
        {
            accountId: "2",
            accountName: "American Summer Camps",
            internalPhoneNumber: "+18773941817",
            conversationConfiguration: {
                firstMessage:
                    "Welcome to the video portion of your ASC application!\n" +
                "INSTRUCTIONS: Please text us an informal, 30 second selfie-video using your phone 🤳\n" +
                "PROMPT: Introduce yourself, skills/experience, and why you want to work at camp! 🏕️\n" +
                "Then you’re done! ✅\n" +
                "Text STOP to opt out anytime.",
                expectedResponseType: ContentTypes.VIDEO,
                lastMessage: "Thank you! From here, we will share your profile with summer camps that have open roles and are currently hiring. Camp Directors will reach out to you directly to initiate the hiring process. 🥳\n" +
                "If anything comes up, please send us a note at hello@americansummercamps.com",
                accountId: "2"
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