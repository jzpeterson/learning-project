Initial node lambda project or upahead


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
