const messagesEl = document.getElementById("messages");
const debugToggle = document.getElementById("debugToggle");
const debugPanel = document.getElementById("debugPanel");
const debugOutput = document.getElementById("debugOutput");
const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const clearBtn = document.getElementById("clearBtn");
const statusText = document.getElementById("statusText");
const runtimeInfo = document.getElementById("runtimeInfo");

let conversation = [];

debugToggle.addEventListener("change", () => {
  debugPanel.classList.toggle("hidden", !debugToggle.checked);
});

clearBtn.addEventListener("click", () => {
  conversation = [];
  messagesEl.innerHTML = "";
  debugOutput.textContent = "";
  statusText.textContent = "在线";
});

document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => {
    input.value = button.dataset.prompt;
    input.focus();
  });
});

function addMessage(role, text = "") {
  const el = document.createElement("div");
  el.className = `message ${role}`;
  el.textContent = text;
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return el;
}

function appendDebug(label, data) {
  if (!debugToggle.checked) return;
  debugOutput.textContent += `\n[${label}]\n${JSON.stringify(data, null, 2)}\n`;
  debugPanel.scrollTop = debugPanel.scrollHeight;
}

async function loadHealth() {
  try {
    const response = await fetch("/api/health");
    const data = await response.json();
    runtimeInfo.textContent = `v${data.version} · ${data.model}`;
  } catch {
    runtimeInfo.textContent = "线上角色对话版";
  }
}

async function sendMessage(message) {
  addMessage("user", message);
  const assistantEl = addMessage("assistant status", "");
  input.disabled = true;
  form.querySelector("button[type='submit']").disabled = true;

  let answer = "";

  function handleEvent(block) {
    const lines = block.split("\n");
    const eventLine = lines.find((line) => line.startsWith("event: "));
    const dataLines = lines.filter((line) => line.startsWith("data: ")).map((line) => line.slice(6));
    if (!eventLine || !dataLines.length) return;
    const event = eventLine.slice(7);
    const data = JSON.parse(dataLines.join("\n"));
    if (event === "token") {
      if (!answer) {
        assistantEl.textContent = "";
        assistantEl.className = "message assistant";
      }
      answer += data;
      assistantEl.textContent = answer;
      messagesEl.scrollTop = messagesEl.scrollHeight;
    } else if (event === "status") {
      statusText.textContent = data;
      if (!answer) assistantEl.textContent = data;
      appendDebug(event, data);
    } else if (event === "debug" || event === "metric") {
      appendDebug(event, data);
    } else if (event === "error") {
      assistantEl.className = "message assistant";
      assistantEl.textContent = `[Error] ${data}`;
      answer = assistantEl.textContent;
      statusText.textContent = "错误";
    }
  }

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({message, conversation, debug: debugToggle.checked})
    });
    if (!response.ok || !response.body) {
      const body = await response.text();
      throw new Error(body || `HTTP ${response.status}`);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const {value, done} = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, {stream: true});
      const blocks = buffer.split("\n\n");
      buffer = blocks.pop();
      for (const block of blocks) handleEvent(block);
    }
    if (buffer.trim()) handleEvent(buffer);
  } catch (error) {
    assistantEl.className = "message assistant";
    assistantEl.textContent = `[Error] ${error.message}`;
    answer = assistantEl.textContent;
    statusText.textContent = "错误";
  }

  conversation.push({role: "user", content: message});
  conversation.push({role: "assistant", content: answer});
  input.disabled = false;
  form.querySelector("button[type='submit']").disabled = false;
  if (statusText.textContent !== "错误") statusText.textContent = "在线";
  input.focus();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = input.value.trim();
  if (!message) return;
  input.value = "";
  sendMessage(message);
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

loadHealth();
