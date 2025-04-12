import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const prompts = {
  utilitarian: "You are a Utilitarian ethicist. Evaluate the fairness of this AI decision.",
  deontological: "You are a Deontological ethicist. Evaluate the fairness of this AI decision.",
  feminist: "You are a Feminist ethicist. Evaluate the fairness of this AI decision.",
  religious: "You are a Religious ethicist. Evaluate the fairness of this AI decision.",
  libertarian: "You are a Libertarian ethicist. Evaluate the fairness of this AI decision."
};

export default async function handler(req, res) {
  const { input } = req.body;
  const results = {};
  for (let agent in prompts) {
    const prompt = `${prompts[agent]}\n\nAI Decision:\n${input}`;
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });
    const text = completion.choices[0].message.content.trim();
    const verdict = text.match(/Fair|Unfair|Sensitive/i)?.[0] || "Unclear";
    results[agent] = verdict;
  }
  return res.status(200).json(results);
}