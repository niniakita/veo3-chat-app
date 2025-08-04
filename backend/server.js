import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.VEO3_API_KEY;
const API_URL = process.env.VEO3_API_URL;

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const veoRes = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY
      },
      body: JSON.stringify({
        prompt: message,
        duration: 8,
        resolution: "1280x720",
        stream: false
      })
    });
    const data = await veoRes.json();
    res.json(data);
  } catch (err) {
    console.error("后端错误：", err);
    res.status(500).json({ error: "Veo3接口调用失败" });
  }
});

app.get("/api/chat-stream", async (req, res) => {
  const message = req.query.q;
  if (!message) return res.status(400).send("缺少参数");

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const veoRes = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY
      },
      body: JSON.stringify({
        prompt: message,
        duration: 8,
        resolution: "1280x720",
        stream: true
      })
    });

    if (!veoRes.body) {
      res.write(`data: [error] 没有返回内容\n\n`);
      return res.end();
    }

    for await (const chunk of veoRes.body) {
      res.write(`data: ${chunk.toString()}\n\n`);
    }
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error(err);
    res.write(`data: [error] ${err.message}\n\n`);
    res.end();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`后端已启动：http://localhost:${PORT}`));
