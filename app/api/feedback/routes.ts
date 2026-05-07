import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { topic, answer } = await req.json();

  const prompt = `
You are an AI learning mentor.

The student just studied:
"${topic}"

Student explanation:
"${answer}"

Your task:
1. Evaluate the explanation
2. Mention what is correct
3. Mention what is missing
4. Encourage the student
5. Keep response beginner friendly
`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();

  return NextResponse.json({
    feedback: data.choices?.[0]?.message?.content,
  });
}