### 调用管理员API

```
curl -H "Authorization: bearer $(gcloud auth print-identity-token)" https://asia-northeast1-windy10v10ai.cloudfunctions.net/
```