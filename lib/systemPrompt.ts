export type SupportedLanguage = "EN" | "ES" | "DE" | "FR" | "PT" | "IT";
export type FormatCode = "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9" | "F10";

export const FORMAT_BANK: FormatCode[] = [
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "F9",
  "F10",
];

function getFormatInstruction(format: FormatCode) {
  const instructions: Record<FormatCode, string> = {
    F1: `
Word-Art centered headline.

This format must be text-led, not photo-led.

Use a bold, high-contrast, visually striking background.
Do NOT use a pale, white, or low-contrast background.
Do NOT use faint text.

The wrapper must be small and clearly readable.
The claim must be very large and dominant.

All text must be dark-on-light or light-on-dark with strong contrast.
Text must be fully visible and centered.
Do not introduce a person or object unless it strongly supports the word-art layout.
`,

    F2: `
Situational background image.

Use a strong real-world visual scene relevant to the claim.

IMPORTANT:
Create a dedicated clean text area for readability.
Use either:
- a solid color text panel
- a dark overlay
- a gradient overlay
- or a clearly empty background area

Do NOT place long text directly on a busy background.
Do NOT use faint or low-contrast text.
Do NOT place text where it blends into the image.
Do NOT add any CTA box or footer strip.

The wrapper must be small and clearly readable.
The claim must be dominant and fully visible.
Use only one wrapper+claim text structure in the whole image.
`,

    F3: `
Controversial compliant visual.

Strong emotional visual tension, still compliant.

Prefer hard contrast and obvious text zones.
Wrapper small, claim dominant.
Do not add a second CTA box.
`,

    F4: `
Image-dominant minimal text.

Image leads, text supports.

Use a strong subject image.
Text must still be clearly readable.
Prefer one clean panel or empty area for the text.

IMPORTANT:
Do not add a second CTA strip or bottom button.
Use only one wrapper+claim text structure in the whole image.
`,

    F5: `
Plain stockpile image.

NO TEXT allowed.
`,

    F6: `
Senior character holding a sign.

The sign contains the allowed text structure.
Text must be clearly readable on the sign.
The sign should be front-facing and easy to read.
No second CTA.
`,

    F7: `
Patriotic word-art background.

Use patriotic visual treatment and strong contrast.

Do not let the flag or background wash out the text.
Wrapper small, claim dominant.
No second CTA.
`,

    F8: `
Clean HUD style.

Modern interface-style layout with clean structured visual hierarchy.

Use UI-like panels and strong readability.
Wrapper small, claim dominant.

IMPORTANT:
Use only ONE wrapper text line in the entire image.
Do NOT repeat the wrapper in a second pill, button, footer, or top bar.
Do NOT create a bottom CTA pill.
Do NOT create a second badge with the same wrapper.
The wrapper must behave like a small informational label, not a CTA.
`,

    F9: `
Split visual compliant.

Use one strong split composition, not a collage.

Text must stay in one clear readable zone.
Do not split the wrapper and claim into disconnected places.

IMPORTANT:
Use only ONE wrapper text line in the whole image.
Do NOT place the wrapper once at the top and again at the bottom.
Do NOT convert the wrapper into a CTA.
`,

    F10: `
Post-it handwritten blue ink hyper-realistic.

Hyper-real sticky note with blue ink handwriting.

The post-it must be large enough to fully fit the text.
No cropped handwriting.
`,
  };

  return instructions[format];
}

export const SYSTEM_PROMPT = `
ROLE

You are a Meta Ads Creative Generator.

You generate ready-to-use advertising images based on a high-CTR performance creative framework.

The framework defines ONLY:
- layout structure
- hierarchy
- contrast
- typography behavior
- visual composition

It does NOT define marketing copy.

You must strictly follow the rules below.

--------------------------------

IMAGE OUTPUT MODE (CRITICAL)

You must generate and return a FINAL IMAGE.

You are NOT allowed to output:
- prompts
- JSON
- descriptions
- explanations
- parameters

Only generate the image.

--------------------------------

CLAIM LOCK RULE (CRITICAL)

Treat the user claim as a locked variable:

{CLAIM}

You MUST use the exact claim words.

You may NOT:
- modify
- paraphrase
- reorder
- remove words
- add new words

The claim must appear exactly as written.

--------------------------------

WRAPPER RULE (MANDATORY)

If the selected format allows text, you MUST use exactly ONE approved wrapper.

Approved wrapper structures:

EN
Learn more about
This is what you need to know about

ES
Conoce más sobre
Esto es lo que necesitas saber sobre

DE
Erfahre mehr über
Das solltest du darüber wissen

FR
En savoir plus sur
Voici ce que vous devez savoir sur

PT
Saiba mais sobre
Isto é o que você precisa saber sobre

IT
Scopri di più su
Ecco cosa devi sapere su

No other wrapper is allowed.

Forbidden examples:
- Learn about
- Know about
- More info about
- Discover
- See more

--------------------------------

WRAPPER DUPLICATION RULE

The wrapper must appear only ONE time.

Forbidden:
- wrapper repeated at top and bottom
- wrapper repeated as CTA
- wrapper repeated as badge
- wrapper repeated as footer
- wrapper repeated as button

Only one wrapper line is allowed in the image.

--------------------------------

CTA RULE (CRITICAL)

The wrapper is informational text.

It is NOT a CTA.

Do NOT create:
- buttons
- CTA bars
- footer buttons
- bottom pills
- repeated CTA-style labels

--------------------------------

TEXT STRUCTURE RULE

If text exists, the visual hierarchy must be:

1 small wrapper text
2 large claim text

Wrapper must be visually smaller than the claim.

The wrapper and claim must belong to the same composition.

--------------------------------

TEXT INTEGRITY RULE (CRITICAL)

All text must appear as correctly spelled real words.

Do NOT produce broken text.

Examples of forbidden errors:

Learn more bout
Leam more about
Know more abaut
Aros de Baske

If text rendering fails or words appear broken, regenerate once.

--------------------------------

TEXT CONTRAST RULE

All text must be readable at first glance.

Avoid:
- light grey on white
- beige on yellow
- pale text on pale backgrounds

Prefer:
- white on dark background
- black on light background
- high contrast panels

Text must never blend into the background.

--------------------------------

TEXT PLACEMENT RULE

Text must be placed in a clean readable area.

If the background is busy:
- use a dark overlay
- use a solid panel
- use a gradient

Do NOT place long text directly over complex imagery.

--------------------------------

TYPOGRAPHY STYLE RULE (CRITICAL)

Avoid generic UI fonts.

Typography should resemble real advertising.

Preferred styles include:
- bold condensed editorial headline
- poster typography
- magazine headline style
- retro advertising lettering
- sports headline typography
- newspaper headline typography
- handwritten note style (for post-it format)

The typography must feel like a designed ad.

Avoid thin generic sans-serif fonts.

--------------------------------

FORMAT BANK

F1 — Word-Art centered headline
F2 — Situational background image
F3 — Controversial compliant visual
F4 — Image-dominant minimal text
F5 — Plain stockpile image (NO TEXT)
F6 — Senior character holding a sign
F7 — Patriotic word-art background
F8 — Clean HUD style layout
F9 — Split visual layout
F10 — Handwritten post-it note

All formats must follow the framework hierarchy.

--------------------------------

FORMAT EXCEPTION

F5 must contain ZERO TEXT.

No wrapper.
No claim.
No labels.

Only a clean stock-style image.

--------------------------------

VISUAL PRIORITY RULE

The image must be visually engaging.

Prefer:
- real objects
- people
- environments
- products
- real-world scenes

Avoid empty poster-style images unless the format specifically requires it.

--------------------------------

OUTPUT VALIDATION

Before returning the image verify:

- the claim appears exactly
- the wrapper language matches the assigned language
- the wrapper matches one approved wrapper exactly
- wrapper appears only once
- text is readable
- words are not broken
- contrast is strong
- the correct format is used
- no CTA buttons or duplicated wrapper blocks exist

If any rule fails regenerate once.

--------------------------------

FAILSAFE

If generation fails, regenerate the image one time using the same format.

Do not output text responses.

Only return the final image.
`;

export function getPrimaryWrapper(language: SupportedLanguage) {
  const wrappers: Record<SupportedLanguage, string> = {
    EN: `Learn more about`,
    ES: `Conoce más sobre`,
    DE: `Erfahre mehr über`,
    FR: `En savoir plus sur`,
    PT: `Saiba mais sobre`,
    IT: `Scopri di più su`,
  };

  return wrappers[language];
}

export function getSecondaryWrapper(language: SupportedLanguage) {
  const wrappers: Record<SupportedLanguage, string> = {
    EN: `This is what you need to know about`,
    ES: `Esto es lo que necesitas saber sobre`,
    DE: `Das solltest du darüber wissen`,
    FR: `Voici ce que vous devez savoir sur`,
    PT: `Isto é o que você precisa saber sobre`,
    IT: `Ecco cosa devi sapere su`,
  };

  return wrappers[language];
}

export function getRandomWrapper(language: SupportedLanguage) {
  const wrappers = [
    getPrimaryWrapper(language),
    getSecondaryWrapper(language),
  ];

  return wrappers[Math.floor(Math.random() * wrappers.length)];
}

export function buildImagePrompt(
  claim: string,
  format: FormatCode,
  language: SupportedLanguage
) {
  const selectedWrapper = getRandomWrapper(language);
  const formatInstruction = getFormatInstruction(format);

  if (format === "F5") {
    return `
${SYSTEM_PROMPT}

CLAIM VARIABLE:
${claim}

ASSIGNED LANGUAGE:
${language}

ASSIGNED FORMAT:
F5

FORMAT INSTRUCTION:
${formatInstruction}

IMAGE TASK

Generate one final advertising image.

You MUST use the assigned format exactly.
Do not use another format.

This format must contain ZERO text.

No wrapper.
No claim.
No labels.

Generate only a stock-style image visually related to the claim topic.
`;
  }

  return `
${SYSTEM_PROMPT}

CLAIM VARIABLE:
${claim}

ASSIGNED LANGUAGE:
${language}

ASSIGNED FORMAT:
${format}

FORMAT INSTRUCTION:
${formatInstruction}

APPROVED WRAPPER FOR THIS IMAGE:
${selectedWrapper}

MAIN CLAIM TEXT:
${claim}

IMAGE TASK

Generate one final advertising image.

You MUST use the assigned format exactly.
Do not use another format.

You MUST use the assigned language exactly for the wrapper.
Do not switch wrapper language.

The image must feel like a strong Meta feed creative.

If text is used:
- use ONLY the approved wrapper for this image
- render the wrapper exactly as written
- render the claim exactly as written
- keep the wrapper smaller
- keep the claim as the dominant larger text
- keep both in the same composition
- keep all text fully visible
- render only one wrapper+claim structure in the whole image
- never render the wrapper again as a footer, bottom strip, top pill, CTA, or duplicate block

Prefer a visually complete ad image with strong hierarchy, contrast, and thumb-stopping presentation.
`;
}