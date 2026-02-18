export async function handler(event) {
  try {
    // 1. Check message
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No message provided" })
      };
    }

    const { message } = JSON.parse(event.body);

    // 2. Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message }]
            }
          ]
        })
      }
    );

    const data = await response.json();
    console.log("GEMINI RESPONSE:", JSON.stringify(data));

    // 3. Handle API error
    if (!response.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: data?.error?.message || "Gemini API failed"
        })
      };
    }

    // 4. Extract reply safely
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI returned empty response";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (err) {
    console.error("FUNCTION CRASH:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message || "Server crashed"
      })
    };
  }
}
