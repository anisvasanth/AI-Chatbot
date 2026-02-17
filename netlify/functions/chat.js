export async function handler(event) {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No message provided" })
      };
    }

    const { message } = JSON.parse(event.body);

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
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    console.log("OPENROUTER RESPONSE:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: data })
      };
    }

    // SAFE RESPONSE EXTRACTION
    let reply =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.text ||
      "AI returned empty response";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
