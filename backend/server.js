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

const taskMap = new Map(); // 用于存储 taskId 与生成结果

app.post("/api/generate", async (req, res) => {
  const { prompt, resolution = "720p", length = 8 } = req.body;
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY
      },
      body: JSON.stringify({
        input: {
          prompt,
          resolution,
          length,
          aspectRatio: "16:9",
          generateAudio: true
        }
      })
    });
    const data = await response.json();
    if (data.taskId) {
      taskMap.set(data.taskId, { status: "waiting" });
      res.json({ taskId: data.taskId });
    } else {
      res.status(500).json({ error: "任务创建失败", detail: data });
    }
  } catch (err) {
    res.status(500).json({ error: "接口调用失败", message: err.message });
  }
});

app.get("/api/status", async (req, res) => {
  const { taskId } = req.query;
  if (!taskId) return res.status(400).json({ error: "缺少 taskId" });

  try {
    const pollRes = await fetch(`https://pollo.ai/api/platform/task/${taskId}`, {
      headers: { "x-api-key": API_KEY }
    });
    const data = await pollRes.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "轮询失败", message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Veo3 后端已启动：http://localhost:${PORT}`));
