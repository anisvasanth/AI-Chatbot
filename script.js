document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Script loaded");

    const chatMessages = document.getElementById("chat-messages");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");

    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");
        messageDiv.classList.add(isUser ? "user-message" : "bot-message");
        const messageText = document.createElement("p");
        messageText.textContent = message;
        messageDiv.appendChild(messageText);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        console.log("📨 User sent:", message);
        addMessage(message, true);
        userInput.value = "";

        const API_KEY = "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"; // ← Replace with your actual key
        const API_URL = "https://openrouter.ai/api/v1/chat/completions";

        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo", // Can change to mistral/mistral-7b-instruct or others
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: message }
                ]
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("🌐 API response:", data);

            if (data.error) {
                addMessage("❌ API Error: " + data.error.message);
                return;
            }

            const botReply = data.choices?.[0]?.message?.content;
            if (botReply) {
                addMessage(botReply);
            } else {
                addMessage("❌ Bot didn't reply properly.");
            }
        })
        .catch(error => {
            console.error("🌐 Fetch error:", error);
            addMessage("❌ Failed to connect to OpenRouter.");
        });
    }

    sendButton.addEventListener("click", () => {
        console.log("🖱️ Send button clicked");
        sendMessage();
    });

    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            console.log("⏎ Enter key pressed");
            sendMessage();
        }
    });
});
