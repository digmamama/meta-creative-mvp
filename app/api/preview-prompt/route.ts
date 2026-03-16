import { NextResponse } from "next/server";
import {
  buildImagePrompt,
  getRandomWrapper,
  SupportedLanguage,
} from "@/lib/systemPrompt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const claim = body?.claim;
    const language = body?.language as SupportedLanguage;

    if (!claim || typeof claim !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid claim" },
        { status: 400 }
      );
    }

    if (!language) {
      return NextResponse.json(
        { error: "Missing language" },
        { status: 400 }
      );
    }

    const wrapper = getRandomWrapper(language);
    const sampleFormat = "F1";
    const prompt = buildImagePrompt(claim, sampleFormat, language);

    return NextResponse.json({
      claim,
      language,
      wrapper,
      sampleFormat,
      prompt,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Preview failed", details: error?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}