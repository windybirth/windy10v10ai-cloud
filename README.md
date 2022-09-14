# windy10v10ai-cloud
Save windy 10v10ai data in cloud.

## Built With
- Firebase 
  - Hosting
  - Functions
  - Realtime Database
- NextJS

## Get Start

### Install
Need
- NodeJs 16
- java
```
npm install -g firebase-tools
(cd cloud && npm install)
```

### Run on local
```
(cd cloud && npm run start)
```
### Local end points
 - Firebase Hosting: http://localhost:5000/api/
 - Firebase Emulator: http://localhost:4000/
 - Function (Not used): http://localhost:5001/windy10v10ai/us-central1/api/

**_NOTE: Debug only works while access to NestJS directly on http://localhost:3000/_**



### Deploy
```
(cd cloud && npm run deploy)
```
 
