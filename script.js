// Correct element selection
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-button");
const chatBox = document.getElementById("chat-messages");

// Safety check
if (!input || !sendBtn || !chatBox) {
  console.error("HTML elements not found. Check IDs!");
}

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

  const thinkingMsg = addMessage("Thinking...", false);

  try {
    const res = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    // remove thinking
    chatBox.lastChild.remove();

    if (!res.ok) {
      addMessage("Server error: " + (data.error || "Unknown error"), false);
      return;
    }

    // Gemini response format
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.reply ||
      "AI returned empty response";

    addMessage(reply, false);

  } catch (err) {
    chatBox.lastChild.remove();
    addMessage("Cannot connect to server", false);
    console.error(err);
  }
}

// Button click
sendBtn.addEventListener("click", sendMessage);

// Enter key
input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});
