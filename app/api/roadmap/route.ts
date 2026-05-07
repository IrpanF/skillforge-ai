import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { goal } = await req.json();

  const prompt = `
You are an AI learning coach.

Create a learning roadmap for:
"${goal}"

Rules:
- Create exactly 5 learning steps
- Each step must be short
- Output ONLY the list
- No explanations
- Format example:

1. HTML Basics
2. CSS Fundamentals
3. JavaScript Basics
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
    roadmap: data.choices?.[0]?.message?.content,
  });
}