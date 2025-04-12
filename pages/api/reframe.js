import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const systemPrompt = \`
You are an Ethical Narrative Reframing Agent. Given an AI decision text,
you must:
1. Reframe the situation with a fair, just, or compassion-based narrative.
2. Suggest an improved output based on this reframed reasoning.
Respond in the format:
Narrative: ...
Rewritten Decision: ...
\`;

export default async function handler(req, res) {
  const { input } = req.body;
  if (!input) return res.status(400).json({ error: "Missing input." });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input }
      ],
      temperature: 0.8,
    });

    const response = completion.choices[0].message.content.trim();
    const [narrative, rewritten] = response.split("Rewritten Decision:");
    return res.status(200).json({
      narrative: (narrative || "").replace("Narrative:", "").trim(),
      rewritten: (rewritten || "").trim()
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to reframe." });
  }
}