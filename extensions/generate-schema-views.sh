#!/bin/bash

read -p "Enter the BigQuery table name: " TBL_NAME

PROJECT_ID=windy10v10ai
BQ_DATASET=firestore_export

npx @firebaseextensions/fs-bq-schema-views \
  --non-interactive \
  --project=${PROJECT_ID} \
  --dataset=${BQ_DATASET} \
  --table-name-prefix=${TBL_NAME} \
  --schema-files=./extensions/${TBL_NAME}_schema.json