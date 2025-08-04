import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.VEO3_API_KEY;
const API_URL = "https://pollo.ai/api/platform/generation/google/veo3";
const STATUS_URL = "https://pollo.ai/api/platform/status";

app.post("/api/generate", async (req, res) => {
  const { prompt, image = "", negativePrompt = "", resolution = "1080p", length = 8, generateAudio = true } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "缺少提示词 prompt" });
  }

  try {
    const polloRes = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY
      },
      body: JSON.stringify({
        input: {
          image,
          prompt,
          negativePrompt,
          length,
          aspectRatio: "16:9",
          resolution,
          seed: 123,
          generateAudio
        }
      })
    });

    const data = await polloRes.json();
    res.json(data);
  } catch (err) {
    console.error("生成任务失败：", err);
    res.status(500).json({ error: "生成失败" });
  }
});

app.get("/api/status", async (req, res) => {
  const { taskId } = req.query;
  if (!taskId) return res.status(400).json({ error: "缺少 taskId 参数" });

  try {
    const polloRes = await fetch(`${STATUS_URL}?taskId=${taskId}`, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY
      }
    });

    const data = await polloRes.json();
    res.json(data);
  } catch (err) {
    console.error("查询状态失败：", err);
    res.status(500).json({ error: "查询失败" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Veo3 后端运行中：http://localhost:${PORT}`));