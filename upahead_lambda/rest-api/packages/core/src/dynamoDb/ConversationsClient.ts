import {DynamoDB} from "aws-sdk";
import {Table} from "sst/node/table";
import {Conversation} from "../conversations/models/_Conversation";
import {Message} from "../conversations/models/_Message";
import {ContentTypes} from "../conversations/enums/ContentTypes";
import {MessageDirection} from "../conversations/enums/MessageDirection";
import {Account, AccountClient} from "./AccountClient";
import {ConversationStatus} from "../conversations/enums/ConversationStatus";

export class ConversationsClient {
    private dynamoDb: DynamoDB.DocumentClient;
    private readonly tableName: string;

    constructor() {
        this.dynamoDb = new DynamoDB.DocumentClient();
        this.tableName = Table.ConversationsTable.tableName;
    }

    /**
     * Adds a new conversation to the DynamoDB table.
     * @param {Conversation} conversation - The conversation object to add.
     */
    public async addConversation(conversation: Conversation): Promise<void> {
        const item = {
            accountId: `CONVERSATION#${conversation.accountId}#${conversation.internalPhoneNumber}`,
            internalPhoneNumber: conversation.internalPhoneNumber,
            externalPhoneNumber: conversation.externalPhoneNumber,
            conversationStartedAt: conversation.conversationStartedAt.toISOString(),
            status: conversation.status,
            conversationConfiguration: conversation.conversationConfiguration,
            messages: conversation.messages
        };

        try {
            await this.dynamoDb.put({
                TableName: this.tableName,
                Item: item
            }).promise();
            console.log("Conversation added successfully.");
        } catch (error) {
            console.error("Error adding conversation:", error);
            throw error; // Re-throw the error after logging
        }
    }

    /**
     * Adds a message to a conversation.
     * @param accountId The account ID associated with the conversation.
     * @param internalPhoneNumber The internal phone number associated with the conversation.
     * @param externalPhoneNumber The external phone number associated with the conversation.
     * @param message The message to add.
     */
    async addMessageToConversation(accountId: string,
                                   internalPhoneNumber: string,
                                   externalPhoneNumber: string,
                                   message: Message): Promise<void> {
        const conversationId = `CONVERSATION#${accountId}#${internalPhoneNumber}`;

        const params: DynamoDB.DocumentClient.UpdateItemInput = {
            TableName: "ConversationsTable",
            Key: {
                accountId: conversationId,
                externalPhoneNumber: externalPhoneNumber,
            },
            UpdateExpression: "SET #messages = list_append(if_not_exists(#messages, :empty_list), :new_message)",
            ExpressionAttributeNames: {
                "#messages": "messages",
            },
            ExpressionAttributeValues: {
                ":new_message": [message],
                ":empty_list": [],
            },
            ReturnValues: "UPDATED_NEW",
        };

        try {
            await this.dynamoDb.update(params).promise();
            console.log("Message added to conversation successfully.");
        } catch (error) {
            console.error("Error adding message to conversation:", error);
            throw error; // Rethrow or handle as needed
        }
    }

    /**
     * Fetches conversations by AccountId and InternalPhoneNumber.
     * @param {string} accountId - The account ID.
     * @param {string} internalPhoneNumber - The internal phone number.
     */
    public async getConversationByAccountIdAndInternalPhoneNumber(accountId: string, internalPhoneNumber: string): Promise<DynamoDB.DocumentClient.QueryOutput> {
        const partitionKey = `CONVERSATION#${accountId}#${internalPhoneNumber}`;

        const params: DynamoDB.DocumentClient.QueryInput = {
            TableName: this.tableName,
            KeyConditionExpression: "accountId = :accountId",
            ExpressionAttributeValues: {
                ":accountId": partitionKey
            }
        };

        try {
            const result = await this.dynamoDb.query(params).promise();
            console.log("Conversations fetched successfully.");
            return result;
        } catch (error) {
            console.error("Error fetching conversations:", error);
            throw error; // Re-throw the error after logging
        }
    }

}

export async function tryToDoTheThing() {
    console.error("Checking if this stuff works")
    const conversationsClient = new ConversationsClient();
    const accountClient = new AccountClient();
    const internalPhoneNumber = "+18446151430"
    const account: Account = await accountClient.getAccountByPhoneNumber(internalPhoneNumber);
    // Define a new conversation
    const newConversation: Conversation = {
        accountId: account.accountId,
        internalPhoneNumber: account.internalPhoneNumber,
        externalPhoneNumber: "+0987654321",
        conversationStartedAt: new Date(),
        status: ConversationStatus.ACTIVE,
        conversationConfiguration: account.conversationConfiguration,
        messages: []
    };

    // Add the new conversation
    await conversationsClient.addConversation(newConversation);

    // Define two messages
    const message1: Message = {
        contentType: ContentTypes.TEXT,
        internalPhoneNumber: newConversation.internalPhoneNumber,
        externalPhoneNumber: newConversation.externalPhoneNumber,
        messageDirection: MessageDirection.INBOUND,
        content: "Hello, this is message 1",
        timestamp: new Date(),
        originalJsonPayload: "cool stuff",
    };

    const message2: Message = {
        contentType: ContentTypes.TEXT,
        internalPhoneNumber: newConversation.internalPhoneNumber,
        externalPhoneNumber: newConversation.externalPhoneNumber,
        messageDirection: MessageDirection.INBOUND,
        content: "Hello, this is message 2",
        timestamp: new Date(),
        originalJsonPayload: "cool stuff 2",
    };

    // Add messages to the conversation
    await conversationsClient.addMessageToConversation(newConversation.accountId, newConversation.internalPhoneNumber, newConversation.externalPhoneNumber, message1);
    await conversationsClient.addMessageToConversation(newConversation.accountId, newConversation.internalPhoneNumber, newConversation.externalPhoneNumber, message2);

    // Retrieve the conversation
    const conversation = await conversationsClient.getConversationByAccountIdAndInternalPhoneNumber(newConversation.accountId, newConversation.internalPhoneNumber);

    console.error("Retrieved conversation:", JSON.stringify(conversation, null, 2));
}
