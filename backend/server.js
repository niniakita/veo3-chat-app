
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

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, resolution = "1080p", length = 8 } = req.body;
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY
      },
      body: JSON.stringify({
        input: {
          prompt,
          negativePrompt: "",
          length,
          aspectRatio: "16:9",
          resolution,
          seed: Math.floor(Math.random() * 99999),
          generateAudio: true
        },
        webhookUrl: ""
      })
    });

    const data = await response.json();
    res.json({ taskId: data.taskId });
  } catch (err) {
    console.error("生成失败：", err);
    res.status(500).json({ error: "调用 VEO3 接口失败" });
  }
});

app.get("/api/status", async (req, res) => {
  const taskId = req.query.taskId;
  if (!taskId) return res.status(400).json({ error: "缺少 taskId" });

  try {
    const statusRes = await fetch(`${API_URL}/task/${taskId}`, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY
      }
    });
    const data = await statusRes.json();
    res.json(data);
  } catch (err) {
    console.error("查询任务失败：", err);
    res.status(500).json({ error: "查询任务状态失败" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`后端已启动：http://localhost:${PORT}`));
