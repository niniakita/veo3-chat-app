const API_BASE = "https://veo3-chat-app-production.up.railway.app";

function appendMsg(content) {
  const div = document.createElement("div");
  div.textContent = content;
  document.getElementById("chat").appendChild(div);
}

async function generate() {
  const prompt = document.getElementById("prompt").value;
  const negativePrompt = document.getElementById("negativePrompt").value;
  const resolution = document.getElementById("resolution").value;
  const length = parseInt(document.getElementById("length").value);
  const generateAudio = document.getElementById("audio").checked;

  if (!prompt) return alert("请输入内容");

  appendMsg("🧠 正在提交任务...");
  const res = await fetch(`${API_BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      negativePrompt,
      resolution,
      length,
      generateAudio
    })
  });
  const data = await res.json();
  if (!data.taskId) return appendMsg("❌ 提交失败");

  appendMsg(`✅ 任务提交成功，任务ID: ${data.taskId}`);
  pollStatus(data.taskId);
}

async function pollStatus(taskId) {
  const interval = setInterval(async () => {
    const res = await fetch(`${API_BASE}/api/status?taskId=${taskId}`);
    const data = await res.json();
    if (data.status === "completed") {
      clearInterval(interval);
      appendMsg("✅ 视频生成完成！");
      appendMsg(`🎞️ 预览链接: ${data.output.videoUrl}`);
    } else if (data.status === "failed") {
      clearInterval(interval);
      appendMsg("❌ 视频生成失败");
    } else {
      appendMsg(`⏳ 当前状态: ${data.status}...`);
    }
  }, 3000);
}
