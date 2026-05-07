import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { topic } = await req.json();

  const prompt = `
You are an AI teacher.

Teach this topic in beginner-friendly way:
"${topic}"

Structure:
1. Simple explanation
2. Easy example
3. Small exercise
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
    lesson: data.choices?.[0]?.message?.content,
  });
}