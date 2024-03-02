import {Api, Bucket, Config, RDS, StackContext, Table} from "sst/constructs";


export function UpAheadStack({stack}: StackContext) {
    const CONVERSATION_DB = "ConversationsDB";

    const TWILIO_ACCOUNT_SID = new Config.Secret(stack, "TWILIO_ACCOUNT_SID");
    const TWILIO_AUTH_TOKEN = new Config.Secret(stack, "TWILIO_AUTH_TOKEN");

    const CLOUD_CONVERT_API_KEY = new Config.Secret(stack, "CLOUD_CONVERT_API_KEY");

    const AWS_ACCESS_KEY_ID = new Config.Secret(stack, "AWS_ACCESS_KEY_ID");
    const AWS_SECRET_ACCESS_KEY = new Config.Secret(stack, "AWS_SECRET_ACCESS_KEY");

    const VIDEO_STORAGE_BUCKET = new Bucket(stack, "VideoStorageBucket");

    const cluster = new RDS(stack, "Cluster", {
        engine: "postgresql13.9",
        defaultDatabaseName: CONVERSATION_DB,
        migrations: 'packages/migrations',
    });

    const conversationsTable = new Table(stack, "ConversationsTable", {
        fields: {
            accountId: "string", // Partition key: "CONVERSATION#<accountPhoneNumber>#<recipientPhoneNumber>"
            internalPhoneNumber: "string",
            externalPhoneNumber: "string", // Sort key: "METADATA#" for conversation metadata, "MESSAGE#<timestamp>" for messages
            conversationStartedAt: "string",
            status: "string",
            conversationConfiguration: "map",
            messages: "list", // Since messages are nested, this is only used if querying single conversation items directly
        },
        primaryIndex: { partitionKey: "accountId", sortKey: "externalPhoneNumber" },
    });

    const api = new Api(stack, "Api", {
        defaults: {
            function: {
                bind: [cluster,
                    conversationsTable,
                    VIDEO_STORAGE_BUCKET,
                    TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, // Needed for sending messages with twilio
                    CLOUD_CONVERT_API_KEY, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY], // Needed for converting files with cloud convert and uploading them to S3
                timeout: 300, // Setting the timeout this high to get data on how long our lambda takes to run
            },
        },
        routes: {
            "POST /webhook/twilio": "packages/functions/src/twilioWebhook.handler",
            "GET /conversations": "packages/functions/src/getConversationsByNumber.handler",
        },
    });

    api.attachPermissions([conversationsTable])

    stack.addOutputs({
        ConversationsTableName: conversationsTable.tableName,
        VideoStorageBucketName: VIDEO_STORAGE_BUCKET.bucketName,
        VideoStorageBucketArn: VIDEO_STORAGE_BUCKET.bucketArn,
        ApiEndpoint: api.url,
        SecretArn: cluster.secretArn,
        ClusterIdentifier: cluster.clusterIdentifier,
    });
}
