# windy10v10ai-cloud

Windy 10v10ai data api

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
- [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
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
 - Function (Not used): http://localhost:5001/windy10v10ai/asia-northeast1/api/api/
 - Firebase Emulator: http://localhost:4000/
 - OpenAPI Document (Swagger): http://localhost:3000/api-doc

# Maintenance

## Deploy

### Deploy with Github Action

Github Action will deploy automatically when push to main and develop.

- main: Deploy Firebase Functions and Hosting
- develop: Deploy Firebase Functions:admin

### Deploy Manually
- Deploy all
```
firebase deploy
```

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
firebase deploy --only functions,hosting
```

## Set environment variables in GitHub Actions

1. Create env in [github secrets and variables](https://github.com/windybirth/windy10v10ai-cloud/settings/secrets/actions)
2. Add env to [deploy_firebase.yml](.github/workflows/deploy_firebase.yml) and [deploy_firebase_admin.yml](.github/workflows/deploy_firebase_admin.yml)

example:
```yaml
        env:
          CONFIG_VALUES: someservice.key=${{ secrets.key }} someservice.id=${{ secrets.id }}
```

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


# Admin API

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

