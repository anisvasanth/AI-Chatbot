// netlify/functions/chat.js

exports.handler = async (event) => {
  try {
    // Allow only POST
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: "Method Not Allowed"
      };
    }

    // Get message from frontend
    const { message } = JSON.parse(event.body || "{}");

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ reply: "No message received" })
      };
    }

    // Call OpenRouter AI
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    // Extract AI reply safely
    let aiResponse = "AI not responding";

    if (data && data.choices && data.choices.length > 0) {
      aiResponse = data.choices[0].message.content;
    }

    // Return to frontend
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        reply: aiResponse
      })
    };

  } catch (error) {
    console.log("FUNCTION ERROR:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        reply: "Server error: " + error.message
      })
    };
  }
};
