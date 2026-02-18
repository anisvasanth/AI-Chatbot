const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = sender === "user" ? "user-message" : "bot-message";
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  try {
    const res = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    if (!res.ok) {
      addMessage("Server error: " + (data.error || "Unknown error"), "bot");
      return;
    }

    addMessage(data.reply, "bot");

  } catch (err) {
    addMessage("Cannot connect to AI server.", "bot");
  }
}

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});
