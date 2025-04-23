# AI-Chatbot
# 💬 AI Chatbot using OpenRouter API

This is a simple, interactive AI chatbot built with **HTML**, **CSS**, and **JavaScript**, powered by **OpenRouter's GPT-3.5-Turbo API**.

---

## ⚙️ How It Works

- The user types a message in the input box and presses **Send** or **Enter**.
- The chatbot sends this message to the **OpenRouter AI API**.
- The assistant (AI) responds based on the model: `openai/gpt-3.5-turbo`.
- Both messages are shown in a chat-style interface.

---

## 🚀 Technologies Used

- HTML & CSS (for layout and styling)
- JavaScript (for logic and API calls)
- [OpenRouter.ai](https://openrouter.ai) (for LLM API)
- Fetch API (for HTTP requests)

---

## 📂 Project Structure

## 📡 API Setup (OpenRouter)

To make the chatbot functional, you'll need to connect it to the OpenRouter AI API:

### 🔐 Steps to Get Your API Key:

1. Go to [https://openrouter.ai](https://openrouter.ai)
2. Sign in or create a free account
3. Navigate to the **Keys** tab from your dashboard
4. Click **Create Key** and copy the generated key (starts with `sk-or-...`)

### 🔧 Configure Your API Key:

Open `script.js` and find this line:

```javascript
const API_KEY = "sk-or-your-api-key-here"; // Replace with your key


