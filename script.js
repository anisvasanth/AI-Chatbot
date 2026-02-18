const input = document.querySelector("input");
const sendBtn = document.querySelector("button");
const chatBox = document.querySelector(".chat-box");

function addMessage(text, isUser) {
  const msg = document.createElement("div");
  msg.className = isUser ? "user-msg" : "bot-msg";
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, true);
  input.value = "";

  addMessage("Thinking...", false);

  try {
    const res = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    chatBox.lastChild.remove();

    if (!res.ok) {
      addMessage("Backend error: " + (data.error || "Unknown"), false);
      return;
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      data.reply ||
      "Empty response";

    addMessage(reply, false);

  } catch (err) {
    chatBox.lastChild.remove();
    addMessage("Cannot connect to server", false);
  }
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});
