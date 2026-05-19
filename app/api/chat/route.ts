import { NextResponse } from "next/server";
import { getGemini, DEFAULT_MODEL } from "@/lib/gemini";

type Role = "user" | "model";

interface ChatMessage {
  role: Role;
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  systemInstruction?: string;
}

export async function POST(req: Request) {
  let body: ChatRequest;
  try {
    body = (await req.json()) as ChatRequest;
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json(
      { error: "messages must be a non-empty array of { role, content }" },
      { status: 400 },
    );
  }

  const contents = body.messages.map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));

  const response = await getGemini().models.generateContent({
    model: body.model ?? DEFAULT_MODEL,
    contents,
    ...(body.systemInstruction
      ? { config: { systemInstruction: body.systemInstruction } }
      : {}),
  });

  return NextResponse.json({ text: response.text });
}
