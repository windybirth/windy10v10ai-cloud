# windy10v10ai-cloud
Save windy 10v10ai data in cloud.

# Built With
- Firebase
  - Hosting
  - Functions
  - Realtime Database
- NextJS

# Get Start

## Installation
### Need
- NodeJs 16
- java
```bash
npm install -g firebase-tools
npm install -g @nestjs/cli
(cd api && npm install)
```

## Running the app
```bash
# development (with watch)
(cd api && npm run start)

# debug
(cd api && npm run start:debug)

# e2e tests
(cd api && npm run test:e2e)
```


**_Tips: If debug or e2e test not working with address already used error, kill nodejs process by `pkill -f node`_**

## Local end points
 - Firebase Hosting: http://localhost:5000/api/
 - Debug end points: http://localhost:3000/api/
 - Function (Not used): http://localhost:5001/windy10v10ai/asia-northeast1/api/api/
 - Firebase Emulator: http://localhost:4000/
 - OpenAPI Document (Swagger): http://localhost:3000/api-doc


# Deploy
- Deploy function only
```bash
# Deploy api function only
firebase deploy --only functions:api
# Deploy admin function only
firebase deploy --only functions:admin
# Deploy all function
firebase deploy --only functions

# Deploy hosting only
firebase deploy --only hosting
# Deploy function and hosting
firebase deploy --only functions, hosting
```
