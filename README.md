
# Veo3 视频生成聊天 UI

这是一个基于 Pollo Veo3 模型的前后端分离应用，支持通过聊天界面生成视频。

## ✨ 功能

- 聊天式输入 prompt
- 可选择视频分辨率（720p / 1080p / 4K）
- 自定义时长（3~20 秒）
- 轮询任务状态，生成成功后展示视频链接

## 🚀 快速部署

### Railway 后端部署

1. 上传本项目，选择 `backend` 文件夹
2. 设置环境变量：
   - `VEO3_API_KEY=你的 API Key`
   - `VEO3_API_URL=https://pollo.ai/api/platform/generation/google/veo3`
3. 部署成功后记下你的域名，例如：
   ```
   https://veo3-chat-app-production.up.railway.app
   ```

### Vercel 前端部署

1. 上传本项目，选择 `frontend` 文件夹
2. 修改 `app.js` 里的 `API_BASE` 为你的后端地址
3. 部署完成即可使用

---
Made with 💙 by AI
