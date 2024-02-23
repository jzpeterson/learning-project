Initial node lambda project or upahead

## Local Database setup
Install Postgres locally. Create a database with db name and settings that match 
`rest-api/packages/core/test/db/test_postgresConversationsDB.ts`. Currently, to run Repository tests successfully,
you wll need to replace the prodDB import with a testDB. This will cause the tests to use the local db. Do not commit this
because it will break prod. 

There is definitely a better way to do this, but I haven't figured it out yet.

## Setting Environment Secrets
To test locally set the following environment variables in a .env file in the root of the project:
```
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
```
To set the secrets in the AWS environment use the following commands:
```
PS C:\Users\jordo\upahead\upahead_node_project\upahead_lambda\rest-api> npx sst secrets set TWILIO_ACCOUNT_SID ********
✔  Setting "TWILIO_ACCOUNT_SID"
PS C:\Users\jordo\upahead\upahead_node_project\upahead_lambda\rest-api> npx sst secrets set TWILIO_AUTH_TOKEN *********   
✔  Setting "TWILIO_AUTH_TOKEN"
```
