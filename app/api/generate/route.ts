import { NextResponse } from "next/server";
import OpenAI from "openai";
import {
  buildImagePrompt,
  FORMAT_BANK,
  FormatCode,
  SupportedLanguage,
} from "@/lib/systemPrompt";
import {
  TEST_IMAGE_COUNT,
  TEST_IMAGE_MODEL,
  TEST_IMAGE_SIZE,
} from "@/lib/config";
import { supabase } from "@/lib/supabase";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const BUCKET = process.env.SUPABASE_BUCKET || "creative-images";

const FORMAT_WEIGHTS: Record<FormatCode, number> = {
  F1: 5,
  F2: 1,
  F3: 1,
  F4: 5,
  F5: 4,
  F6: 2,
  F7: 4,
  F8: 1,
  F9: 2,
  F10: 5,
};

function weightedShuffleFormats(): FormatCode[] {
  const pool = FORMAT_BANK.flatMap((format) =>
    Array(FORMAT_WEIGHTS[format]).fill(format)
  );

  const shuffledPool = [...pool].sort(() => Math.random() - 0.5);

  const uniqueFormats: FormatCode[] = [];

  for (const format of shuffledPool) {
    if (!uniqueFormats.includes(format)) {
      uniqueFormats.push(format);
    }
  }

  for (const format of FORMAT_BANK) {
    if (!uniqueFormats.includes(format)) {
      uniqueFormats.push(format);
    }
  }

  return uniqueFormats;
}

function pickWeightedFormats(count: number): FormatCode[] {
  return weightedShuffleFormats().slice(0, count);
}

function sanitizeClaim(claim: string) {
  return claim
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);
}

async function uploadBase64ImageToSupabase(
  base64: string,
  claim: string,
  index: number
) {
  const cleanClaim = sanitizeClaim(claim);
  const timestamp = Math.floor(Date.now() / 1000);
  const fileName = `${cleanClaim}_${timestamp}_${index}.png`;

  const bytes = Buffer.from(base64, "base64");

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, bytes, {
      contentType: "image/png",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Supabase upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

  return {
    fileName,
    publicUrl: data.publicUrl,
  };
}

async function saveCreativeRecord(params: {
  claim: string;
  language: SupportedLanguage;
  format: FormatCode;
  fileName: string;
  imageUrl: string;
}) {
  const { error } = await supabase.from("creatives").insert({
    claim: params.claim,
    language: params.language,
    format: params.format,
    file_name: params.fileName,
    image_url: params.imageUrl,
  });

  if (error) {
    throw new Error(`Supabase DB insert failed: ${error.message}`);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const claim = body?.claim;
    const count = Number(body?.count || TEST_IMAGE_COUNT);
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

    const safeCount = Math.max(1, Math.min(10, count));
    const formats = pickWeightedFormats(safeCount);

    const images: string[] = [];
    const fileNames: string[] = [];

    for (let i = 0; i < safeCount; i++) {
      const format = formats[i];
      const prompt = buildImagePrompt(claim, format, language);

      const result = await client.images.generate({
        model: TEST_IMAGE_MODEL,
        prompt,
        size: TEST_IMAGE_SIZE,
        n: 1,
      });

      const img = result.data?.[0];

      if (img?.b64_json) {
        const uploaded = await uploadBase64ImageToSupabase(
          img.b64_json,
          claim,
          i + 1
        );

        await saveCreativeRecord({
          claim,
          language,
          format,
          fileName: uploaded.fileName,
          imageUrl: uploaded.publicUrl,
        });

        images.push(uploaded.publicUrl);
        fileNames.push(uploaded.fileName);
      } else if (img?.url) {
        await saveCreativeRecord({
          claim,
          language,
          format,
          fileName: "",
          imageUrl: img.url,
        });

        images.push(img.url);
        fileNames.push("");
      }
    }

    return NextResponse.json({
      images,
      formats,
      fileNames,
    });
  } catch (error: any) {
    console.error("IMAGE GENERATION ERROR:", error);

    return NextResponse.json(
      {
        error: "Image generation failed",
        details: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}