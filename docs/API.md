### 调用管理员API

```
curl -H "Authorization: bearer $(gcloud auth print-identity-token)" https://us-central1-windy10v10ai.cloudfunctions.net/
```