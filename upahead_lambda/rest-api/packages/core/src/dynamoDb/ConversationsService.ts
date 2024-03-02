import {AccountClient} from "./AccountClient";
import {ConversationsClient} from "./ConversationsClient";
import {Conversation} from "../conversations/models/_Conversation";
import {ConversationStatus} from "../conversations/enums/ConversationStatus";

export class ConversationsService {
    private conversationsClient: ConversationsClient;
    private accountClient: AccountClient;

    constructor() {
        this.conversationsClient = new ConversationsClient();
        this.accountClient = new AccountClient();
    }

    public async startConversation(internalPhoneNumber: string, externalPhoneNumber: string): Promise<void> {
        const account = await this.accountClient.getAccountByPhoneNumber(internalPhoneNumber);
        if (!account) {
            throw new Error("Account not found.");
        }
        if (!account.conversationConfiguration) {
            throw new Error("Account does not have a conversation configuration.");
        }
        if (!internalPhoneNumber) {
            throw new Error("Conversation does not have an internal phone number.");
        }
        if (!externalPhoneNumber) {
            throw new Error("Conversation does not have an external phone number.");
        }

        const conversation: Conversation = {
            accountId: account.accountId,
            internalPhoneNumber: internalPhoneNumber,
            externalPhoneNumber: externalPhoneNumber,
            conversationStartedAt: new Date(),
            status: ConversationStatus.ACTIVE,
            conversationConfiguration: account.conversationConfiguration,
            messages: []
        };

        await this.conversationsClient.addConversation(conversation);
    }



    // public async getConversationsByAccountId(accountId: string): Promise<Conversation | null> {
    //     return this.conversationsClient.getConversationByAccountId(phoneNumber);
    // }
}