import { NextResponse } from 'next/server';
import { getGemini, DEFAULT_MODEL } from '@/lib/gemini';

export async function GET() {
  try {
    const ai = getGemini();
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: 'Give me a short, highly motivational fitness quote for a 60-second rest period during a high-intensity interval training session. It should be empowering and intense. Do not include quote marks around it, just the raw text.',
    });
    return NextResponse.json({ quote: response.text });
  } catch (error) {
    console.error('Error generating quote:', error);
    return NextResponse.json({ quote: 'Keep pushing! You are stronger than you think. The pain you feel today is the strength you feel tomorrow.' });
  }
}
