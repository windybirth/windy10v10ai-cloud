# windy10v10ai-cloud
Save windy 10v10ai data in cloud.

# Built With
- Firebase 
  - Hosting
  - Functions
  - Realtime Database
- NextJS

# Get Start

## Install
Need
- NodeJs 16
- java
```
npm install -g firebase-tools
(cd cloud && npm install)
```

## Run on local
```
(cd cloud && npm run start)
```
### Local end points
 - Firebase Hosting: http://localhost:5000/api/
 - Firebase Emulator: http://localhost:4000/
 - Function (Not used): http://localhost:5001/windy10v10ai/asia-northeast1/api/

## Debug and E2E Setting
1. Copy `~/.config/firebase/<YOUR_MAIL_ADDRESS>_application_default_credentials.json` or `~/.config/gcloud/application_default_credentials.json` to `cloud/application_default_credentials.json`
<!-- 2. Run 
```
echo "export GOOGLE_APPLICATION_CREDENTIALS='application_default_credentials.json'" >> ~/.bash_profile
echo "export FIRESTORE_EMULATOR_HOST='localhost:8080'" >> ~/.bash_profile
source ~/.bash_profile
``` -->


### Debug
```
(cd cloud && npm run start:debug)
```
 - Debug end points: http://localhost:3000/api/
### E2E Test
```
(cd cloud && npm run test:e2e)
```
**_Tips: If debug or e2e test not working with address already used error, kill nodejs process by `pkill -f node`_**

## Deploy
- Deploy function only
```
(cd cloud && npm run deploy)
```

- Deploy firebase hosting only
```
firebase deploy --only hosting
```