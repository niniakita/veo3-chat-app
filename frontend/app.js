const API_BASE = "https://YOUR_RAILWAY_DOMAIN.up.railway.app"; 
const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");

let chatHistory = JSON.parse(localStorage.getItem("chatHistory") || "[]");
renderChatHistory();

function appendMessage(role, text) {
  const messageEl = document.createElement("div");
  messageEl.className = `message ${role}`;
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;
  messageEl.appendChild(bubble);
  chatBox.appendChild(messageEl);
  chatBox.scrollTop = chatBox.scrollHeight;
  return bubble;
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
clearBtn.addEventListener("click", clearChat);

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  chatHistory.push({ role: "user", content: text });
  appendMessage("user", text);

  const aiBubble = appendMessage("ai", "");
  chatHistory.push({ role: "ai", content: "" });

  const url = `${API_BASE}/api/chat-stream?q=${encodeURIComponent(text)}`;
  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    if (event.data === "[DONE]") {
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
      eventSource.close();
    } else {
      aiBubble.textContent += event.data;
      chatHistory[chatHistory.length - 1].content = aiBubble.textContent;
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  };

  eventSource.onerror = () => {
    aiBubble.textContent = "⚠️ 出错了，请重试";
    eventSource.close();
  };
}

function clearChat() {
  chatHistory = [];
  localStorage.removeItem("chatHistory");
  chatBox.innerHTML = "";
}

function renderChatHistory() {
  chatBox.innerHTML = "";
  chatHistory.forEach((m) => appendMessage(m.role, m.content));
}