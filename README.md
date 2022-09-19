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
 - Function (Not used): http://localhost:5001/windy10v10ai/us-central1/api/

## Debug on local
1. Copy `~/.config/firebase/<YOUR_MAIL_ADDRESS>_application_default_credentials.json` or `~/.config/gcloud/application_default_credentials.json` to `cloud/application_default_credentials.json`
2. Run 
```
(cd cloud && npm run start:debug)
```

 - Debug end points: http://localhost:3000/api/

**_NOTE: If not use `start:debug`, accessing this end point may access to Product enviroment!_**


## Deploy
```
(cd cloud && npm run deploy)
```
 
