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

CLOUD_CONVERT_API_KEY // This is used for our 3rd party file conversion service

AWS_ACCESS_KEY_ID // This is not secure and we need a better way to authenticate :(
AWS_SECRET_ACCESS_KEY
```
To set the secrets in the AWS environment use the following commands:
```
PS C:\Users\jordo\upahead\upahead_node_project\upahead_lambda\rest-api> npx sst secrets set TWILIO_ACCOUNT_SID ********
✔  Setting "TWILIO_ACCOUNT_SID"
PS C:\Users\jordo\upahead\upahead_node_project\upahead_lambda\rest-api> npx sst secrets set TWILIO_AUTH_TOKEN *********   
✔  Setting "TWILIO_AUTH_TOKEN"

npx sst secrets set CLOUD_CONVERT_API_KEY ********

npx sst secrets set AWS_ACCESS_KEY_ID ********

npx sst secrets set AWS_SECRET_ACCESS_KEY ********
```
When updating secrets in the in prod environment append `--stage prod` to the command.


Known issues:
- We should not have a backup webhook url in twilio or it can lead to multiple messages being sent on cold starts.
