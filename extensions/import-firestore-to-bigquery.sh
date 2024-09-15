#!/bin/bash

read -p "Enter the Firestore collection name: " SOURCE_FS_COLLECTION
read -p "Enter the BigQuery table name: " TBL_NAME


PROJECT_ID=windy10v10ai
BQ_DATASET=firestore_export
BATCH_SIZE=300

npx @firebaseextensions/fs-bq-import-collection \
  --non-interactive \
  --project ${PROJECT_ID} \
  --big-query-project ${PROJECT_ID} \
  --source-collection-path ${SOURCE_FS_COLLECTION} \
  --dataset ${BQ_DATASET} \
  --table-name-prefix ${TBL_NAME} \
  --query-collection-group false \
  --multi-threaded true \
  --use-emulator false \
  --dataset-location asia-northeast1 \
  --batch-size ${BATCH_SIZE}