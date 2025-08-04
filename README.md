# Veo3 Chat App

一个基于 **Node.js + Express + ChatGPT风格前端** 的 AI 聊天应用，支持：
- 🌐 ChatGPT 风格多轮对话界面（支持移动端）
- ⏱️ **流式输出（实时打字）**，不支持时自动回退打字机模式
- 💾 **本地聊天记录保存（localStorage）**
- 🧹 一键清空聊天记录
- 📋 回复内容一键复制

---

## 项目结构


---

## 部署指南

### 1. Railway 部署后端

1. 打开 [Railway](https://railway.app/) → 用 GitHub 登录  
2. 新建 Project → 选择你的 GitHub 仓库 → 选择 `backend/` 文件夹  
3. 在 **Variables** 填写环境变量：
VEO3_API_KEY = 你的Veo3 Key
VEO3_API_URL = https://api.veo3.com/v1/chat
PORT = 3000



---

### 2. Vercel 部署前端

1. 打开 [Vercel](https://vercel.com/) → 用 GitHub 登录  
2. 新建 Project → 选择你的 GitHub 仓库 → 选择 `frontend/` 文件夹  
3. 部署完成后，Vercel 会生成一个域名，例如：

4. https://veo3-chat.vercel.app
