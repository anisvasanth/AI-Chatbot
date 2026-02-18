const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-button");
const chatBox = document.getElementById("chat-messages");

// Add message to UI
function addMessage(text, isUser) {
  const msg = document.createElement("div");
  msg.className = isUser ? "message user-message" : "message bot-message";

  const p = document.createElement("p");
  p.textContent = text;

  msg.appendChild(p);
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message to backend
async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, true);
  input.value = "";

  // thinking message
  const thinking = document.createElement("div");
  thinking.className = "message bot-message";
  thinking.innerHTML = "<p>Thinking...</p>";
  chatBox.appendChild(thinking);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    thinking.remove();

    if (!res.ok) {
      addMessage("Server error: " + (data.error || "Unknown error"), false);
      return;
    }

    addMessage(data.reply, false);

  } catch (err) {
    thinking.remove();
    addMessage("Cannot connect to server", false);
  }
}

// Click send
sendBtn.addEventListener("click", sendMessage);

// Press Enter
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
