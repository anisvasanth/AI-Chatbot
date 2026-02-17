document.addEventListener("DOMContentLoaded", () => {

    const chatMessages = document.getElementById("chat-messages");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");

    // FORMAT AI RESPONSE
    function formatMessage(message) {
        return message
            .replace(/^### (.*$)/gim, "<h3>$1</h3>")
            .replace(/^## (.*$)/gim, "<h2>$1</h2>")
            .replace(/^# (.*$)/gim, "<h1>$1</h1>")
            .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
            .replace(/\*(.*?)\*/g, "<i>$1</i>")
            .replace(/^- (.*)$/gim, "• $1")
            .replace(/\n/g, "<br>");
    }

    function addMessage(message, isUser = false) {

        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", isUser ? "user-message" : "bot-message");

        const messageText = document.createElement("div");
        messageText.classList.add("message-text");

        messageText.innerHTML = isUser ? message : formatMessage(message);

        messageDiv.appendChild(messageText);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // SEND MESSAGE TO NETLIFY FUNCTION
    function sendMessage() {

        const message = userInput.value.trim();
        if (!message) return;

        addMessage(message, true);
        userInput.value = "";

        fetch("/.netlify/functions/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message })
        })
        .then(res => res.json())
        .then(data => {

            if (!data || data.error) {
                addMessage("Server error. Check backend.");
                return;
            }

            const reply = data.choices?.[0]?.message?.content;
            addMessage(reply || "No response from AI");

        })
        .catch(err => {
            console.error(err);
            addMessage("Connection failed.");
        });
    }

    sendButton.addEventListener("click", sendMessage);

    userInput.addEventListener("keydown", e => {
        if (e.key === "Enter") sendMessage();
    });

});