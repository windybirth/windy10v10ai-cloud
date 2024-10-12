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
  - Firestore Database
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
firebase use windy10v10ai

# setup package
npm install

# web setting
firebase experiments:enable webframeworks
```

### Set GCP (Optional)

Install gCloud SDK: https://cloud.google.com/sdk/docs/install

```bash
# Authenticate with gcloud
gcloud auth login
```

## Running the app

### Start Firebase Emulator
```bash
npm run start
```

### Start Firebase Emulator with data

Need Authenticate with gcloud

```bash
# download data from storage (run only once)
rm -rf firestore-backup
mkdir firestore-backup
(cd firestore-backup && gsutil -m cp -r \
  "gs://windy10v10ai.appspot.com/firestore-backup/20240529/20240529.overall_export_metadata" \
  "gs://windy10v10ai.appspot.com/firestore-backup/20240529/all_namespaces" \
  .)

# start emulator with data
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
curl -H "Authorization: bearer $(gcloud auth print-identity-token)" https://asia-northeast1-windy10v10ai.cloudfunctions.net/admin/api
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

or Edit [firebase.json](/firebase.json) and create `extensions/firestore-bigquery-export-xxx.env`
```json
  "extensions": {
    "firestore-bigquery-export-xxx": "firebase/firestore-bigquery-export@0.1.54"
  }
```

### Deploy Firestore to BigQuery

```bash
firebase deploy --only extensions
```

### Import existing documents (need gcp auth)

[Guides](https://github.com/firebase/extensions/blob/master/firestore-bigquery-export/guides/IMPORT_EXISTING_DOCUMENTS.md)

Setup gcloud default auth
```bash
gcloud auth application-default login
```

Run import command
```bash
sh ./extensions/import-firestore-to-bigquery.sh
```


### Generate schema views

Create schema file `table_name_schema.json` and run command.

[How to create schema file](https://github.com/firebase/extensions/blob/next/firestore-bigquery-export/guides/GENERATE_SCHEMA_VIEWS.md#how-to-configure-schema-files)

```bash
sh ./extensions/generate-schema-views.sh
```