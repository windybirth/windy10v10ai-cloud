### 调用管理员API

```
curl -H "Authorization: bearer $(gcloud auth print-identity-token)" https://asia-northeast1-windy10v10ai.cloudfunctions.net/admin
curl -H "Authorization: bearer $(gcloud auth print-identity-token)" https://windy10v10ai.web.app/api/admin
```