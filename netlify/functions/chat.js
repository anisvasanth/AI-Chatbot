export async function handler(event) {
  try {

    // check body
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No message provided" })
      };
    }

    const { message } = JSON.parse(event.body);

    // call OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
        "HTTP-Referer": "https://ai-chatbot-anis.netlify.app",
        "X-Title": "AI Chatbot"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant. Respond clearly using headings and bullet points." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    // important: send only TEXT not full JSON
    const reply = data?.choices?.[0]?.message?.content || "AI returned empty response";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })   // <-- FIX
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
