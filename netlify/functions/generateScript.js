const OpenAI = require("openai");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  const { char1, char2, location, object } = JSON.parse(event.body);

  console.log("Received inputs:", char1, char2, location, object);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `You're a deranged screenwriter. Write a hilariously awful, chaotic, poorly written 15-line movie script. Use the following details:

Character 1: ${char1}
Character 2: ${char2}
Location: ${location}
Object: ${object}

The script should include absurd plot twists, surreal dialogue, and over-the-top formatting. Make it completely unhinged and ridiculous.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 1.2,
      max_tokens: 400,
    });

    const script = completion.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ script }),
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate script." }),
    };
  }
};