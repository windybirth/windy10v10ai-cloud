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
# firebase setting
npm install -g firebase-tools
firebase login

# api setting
npm install -g @nestjs/cli
(cd api && npm install)

# web setting
(cd web && npm install)
firebase experiments:enable webframeworks
```

## Running the app

### Start Firebase Emulator
```bash
npm run start

# download data from storage (need auth)
# (run only once)
rm -rf firestore-backup
mkdir firestore-backup
(cd firestore-backup && gsutil -m cp -r \
  "gs://windy10v10ai.appspot.com/firestore-backup/20230331/20230331.overall_export_metadata" \
  "gs://windy10v10ai.appspot.com/firestore-backup/20230331/all_namespaces" \
  .)

# start firebase with data
npm run start:with-data
```

### Run API
```bash
# debug (need start firebase emulator)
(cd api && npm run start:debug)

# unit tests
(cd api && npm run test)

# e2e tests (need stop firebase emulator)
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
# Use Admin API

## Need
- gcloud cli

## CLI
```
curl -H "Authorization: bearer $(gcloud auth print-identity-token)" https://asia-northeast1-windy10v10ai.cloudfunctions.net/admin
curl -H "Authorization: bearer $(gcloud auth print-identity-token)" https://windy10v10ai.web.app/api/admin
```

## Postman

``` bash
## Get token
echo $(gcloud auth print-identity-token)
```
Import `api/swagger-spec.yaml` to postman with variable `baseUrl` : `https://asia-northeast1-windy10v10ai.cloudfunctions.net/admin`