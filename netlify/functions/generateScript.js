const { Configuration, OpenAIApi } = require("openai");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { char1, char2, location, object } = JSON.parse(event.body);

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const prompt = `You're a deranged screenwriter. Write a hilariously awful, chaotic, poorly written 15-line movie script. Use the following details:\n\nCharacter 1: ${char1}\nCharacter 2: ${char2}\nLocation: ${location}\nObject: ${object}\n\nThe script should include absurd plot twists, surreal dialogue, and over-the-top formatting. Make it completely unhinged and ridiculous.`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 1.2,
      max_tokens: 400,
    });

    const script = completion.data.choices[0].message.content;

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