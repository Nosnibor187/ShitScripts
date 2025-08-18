const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async (event) => {
  try {
    const { char1, char2, location, object, customPrompt, promptType } = JSON.parse(event.body);

    console.log("Received inputs:", char1, char2, location, object, promptType);

    // Fallback to default if no type passed
    const type = promptType || "default";

    const categoryInstructions = {
      default: "Write a chaotic, unhinged and hilarious short film script with no regard for structure or sense. Keep it weird.",
      romcom: "Write a parody rom-com short film script. Full of misunderstandings, awkward flirting, and at least one food fight.",
      thriller: "Write a chaotic, over-the-top thriller script. Include betrayal, shouting, and several implausible plot twists.",
      fantasy: "Write an absurd fantasy script. Dragons, cursed swords, maybe a talking goat. Go wild.",
    };

    const systemPrompt = categoryInstructions[type] || categoryInstructions["default"];

    const userPrompt = customPrompt?.trim()
      ? customPrompt
      : `Create a short, ridiculous script featuring ${char1} and ${char2} at ${location} involving a cursed ${object}. Make it unhinged.`

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.95,
      max_tokens: 1000,
    });

    const script = response.choices?.[0]?.message?.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ script }),
    };
  } catch (err) {
    console.error("OpenAI API error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Something went wrong." }),
    };
  }
};