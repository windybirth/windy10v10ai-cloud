# windy10v10ai-cloud

Backend for [Windy 10v10ai](https://github.com/windybirth/windy10v10ai) with Firebase

- [Built With](#built-with)
- [Get Start](#get-start)
  - [Installation](#installation)
  - [Running the app](#running-the-app)
  - [Local end points](#local-end-points)
- [Maintenance](#maintenance)
  - [Deploy](#deploy)
  - [Backup Firestore](#backup-firestore)
  - [Update dependencies](#update-dependencies)
- [Admin API](#admin-api)
  - [Need](#need)
  - [CLI](#cli)
  - [Postman](#postman)


# Built With
- Firebase
  - Hosting
  - Functions
  - Realtime Database
- NextJS

# Get Start

## Installation
### Need
- Java
- Node v20
  - Recommend install node use [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)

```bash
# firebase setting
npm install -g firebase-tools
firebase login

# setup package
npm install

# web setting
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
  "gs://windy10v10ai.appspot.com/firestore-backup/20240529/20240529.overall_export_metadata" \
  "gs://windy10v10ai.appspot.com/firestore-backup/20240529/all_namespaces" \
  .)

# start firebase with data
npm run start:with-data
```

gsutil install && 运行 gcloud init login ad
https://cloud.google.com/storage/docs/gsutil_install?hl=zh-cn#deb

### Run API
```bash
# debug (need start firebase emulator)
(cd api && npm run start:debug)

# REPL
(cd api && npm run start -- --entryFile repl)

# unit tests
(cd api && npm run test)

# e2e tests (need stop firebase emulator)
(cd api && npm run test:e2e)
```


**_Tips: If debug or e2e test not working with address already used error, kill nodejs process by `pkill -f node`, or try to restart winnat_**
```
net stop winnat
net start winnat
```

## Local end points
 - Firebase Hosting: http://localhost:5000/api/
 - Debug end points: http://localhost:3000/api/
 - Function (Not used): http://localhost:5001/windy10v10ai/asia-northeast1/client/api/
 - Firebase Emulator: http://localhost:4000/
 - OpenAPI Document (Swagger): http://localhost:3000/api-doc

# Maintenance

## Deploy

### Deploy with Github Action

Github Action will deploy automatically when push to main branch.

- main: Deploy Firebase Functions and Hosting

### Deploy Manually
- Deploy all
```
firebase deploy
```

- Deploy part
```bash
# Deploy api function only
firebase deploy --only functions:client
firebase deploy --only functions:afdian
firebase deploy --only functions:patreon
firebase deploy --only functions:admin
# Deploy all function
firebase deploy --only functions

# Deploy hosting only
firebase deploy --only hosting
# Deploy function and hosting
firebase deploy --only functions,hosting
```

## Set secret environment variables 

1. Create env in [secret manager](https://console.cloud.google.com/security/secret-manager?project=windy10v10ai)
2. Set function run with secrets in [index.ts](api/src/index.ts)
3. Use secrets as `process.env.SECRET_NAME` in code

## Allow/Disable unauthenticated HTTP function invocation

https://cloud.google.com/functions/docs/securing/managing-access-iam#allowing_unauthenticated_http_function_invocation

## Backup Firestore

https://console.cloud.google.com/firestore/databases/-default-/import-export?project=windy10v10ai

## Update dependencies
- Update package.json
```bash
# install tool
`npm install -g npm-check-updates`

# cd to dir
cd api
# update package.json
ncu -u
# update package-lock.json
npm update
```

## Use Admin API

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

# Extension

## Export Firestore to Bigquery

### Setup Stream Firestore to BigQuery

```bash
firebase ext:install firebase/firestore-bigquery-export
```

or Edit [firebase.json](/firebase.json) and `extensions/firestore-bigquery-export-xxx.env`
```json
  "extensions": {
    "firestore-bigquery-export-test": "firebase/firestore-bigquery-export@0.1.53"
  }
```

### Deploy Firestore to BigQuery

```bash
firebase deploy --only extensions
```

### Import existing documents

[Guides](https://github.com/firebase/extensions/blob/master/firestore-bigquery-export/guides/IMPORT_EXISTING_DOCUMENTS.md)

```bash
npx @firebaseextensions/fs-bq-import-collection
```

Example:

> ? What is your Firebase project ID? windy10v10ai<br>
 ? What is your BigQuery project ID? windy10v10ai<br>
? What is the path of the the Cloud Firestore Collection you would like to import from? (This may, or may not, be the same Collection for which you plan to mirror changes.) test<br>
? Would you like to import documents via a Collection Group query? No<br>
? What is the ID of the BigQuery dataset that you would like to use? (A dataset will be created if it doesn't already exist) firestore_export<br>
? What is the identifying prefix of the BigQuery table that you would like to import to? (A table will be created if one doesn't already exist) test<br>
? How many documents should the import stream into BigQuery at once? 300<br>
? Where would you like the BigQuery dataset to be located? asia-northeast1<br>
? Would you like to run the import across multiple threads? Yes<br>
? Would you like to use the new optimized snapshot query script? Yes<br>
? Would you like to use a local firestore emulator? No<br>

### Generate schema views

```bash
npx @firebaseextensions/fs-bq-schema-views \
  --non-interactive \
  --project=windy10v10ai \
  --dataset=firestore_export \
  --table-name-prefix=test \
  --schema-files=./extensions/test_schema.json
```