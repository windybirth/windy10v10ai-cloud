# windy10v10ai-cloud Firebase
- Firebase Host
- Cloud Function
- Realtime Database

## Firebase Host
用于转发API请求。
Host站点 https://windy10v10ai.web.app/

API转发 https://windy10v10ai.web.app/api/
设置于 firebase.json的`rewrites`

## 命令集
### 本地运行
```
cd functions/
npm run serve
```
### Deploy
Deploy对象在`functions/package.json`中设置，
```
cd functions/
#
npm run deploy
```


### 调用管理员API

```
curl  -H "Authorization: bearer $(gcloud auth print-identity-token)" https://us-central1-windy10v10ai.cloudfunctions.net/
```
身份验证文档：https://cloud.google.com/functions/docs/securing/authenticating?hl=zh

## 各种链接
Cloud Function管理界面
https://console.cloud.google.com/functions/list?authuser=0&hl=zh&project=windy10v10ai