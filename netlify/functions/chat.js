export async function handler(event) {
  try {

    // check request body
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
        "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant. Respond clearly using headings and bullet points." },
          { role: "user", content: message }
        ]
      })
    });

    // if API failed
    if (!response.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "AI API request failed" })
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (error) {
  console.log("FULL ERROR:", error);
  console.log("ERROR MESSAGE:", error.message);

  return {
    statusCode: 500,
    body: JSON.stringify({
      reply: "ERROR: " + error.message
    })
  };
}
