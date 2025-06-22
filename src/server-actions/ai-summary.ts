"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export type SummaryFormat =
  | "paragraph"
  | "bullet-points"
  | "headline"
  | "section-wise";

interface SummaryRequest {
  content: string;
  format: SummaryFormat;
  title?: string;
}

interface SummaryResponse {
  summary: string;
  wordCount: number;
  format: SummaryFormat;
  error?: string;
}

const getFormatInstructions = (format: SummaryFormat): string => {
  switch (format) {
    case "paragraph":
      return "Write a concise summary in a flowing paragraph format. Make it coherent and easy to read. Use **bold** for emphasis on key terms if needed. Keep it around 100 words.";
    case "bullet-points":
      return "List the key points in clear, easy-to-read bullet points. Use markdown formatting:\n- Use **bold** for important terms\n- Each point should be concise\n- Use proper markdown list formatting with - or *\n- Keep it around 100 words total";
    case "headline":
      return "Provide a single, impactful sentence summarizing the article. Make it compelling and informative. Use **bold** for emphasis if needed.";
    case "section-wise":
      return "Break down the article into logical sections, with each section having a short summary. Use markdown formatting:\n## Section Title\nBrief summary of this section\n\n## Next Section\nBrief summary of this section\n\nUse **bold** for section titles and important terms. Keep each section concise.";
    default:
      return "Write a standard paragraph summary around 100 words.";
  }
};

export async function generateSummary({
  content,
  format,
  title,
}: SummaryRequest): Promise<SummaryResponse> {
  try {
    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    // Validate input
    if (!content || content.trim().length === 0) {
      throw new Error("Content is required");
    }

    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    // Create the prompt
    const formatInstructions = getFormatInstructions(format);
    const prompt = `
You are an expert content summarizer. Please summarize the following content according to these requirements:

${formatInstructions}

Content to summarize:
${title ? `Title: ${title}\n\n` : ""}${content}

IMPORTANT: Use proper markdown formatting in your response:
- Use **bold** for emphasis and important terms
- Use ## for section headers (if applicable)
- Use - or * for bullet points (if applicable)
- Use proper line breaks and spacing
- Ensure the formatting is clean and readable

Please provide only the summary text in the requested format without any additional formatting, explanations, or meta-commentary. Make sure the summary is well-structured and easy to read.
`;

    // Generate the summary
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text().trim();

    // Count words
    const wordCount = summary.split(/\s+/).length;

    return {
      summary,
      wordCount,
      format,
    };
  } catch (error) {
    console.error("Error generating summary:", error);
    return {
      summary: "",
      wordCount: 0,
      format,
      error:
        error instanceof Error ? error.message : "Failed to generate summary",
    };
  }
}

// Helper function to get summary with specific word limits
export async function getSummaryWithLimit(
  content: string,
  maxWords: number,
  format: SummaryFormat = "paragraph",
  title?: string
): Promise<SummaryResponse> {
  return generateSummary({ content, format, title });
}

// Batch summary generation for multiple formats
export async function generateMultiFormatSummary(
  content: string,
  title?: string
): Promise<{
  paragraph: SummaryResponse;
  bulletPoints: SummaryResponse;
  headline: SummaryResponse;
  sectionWise: SummaryResponse;
}> {
  const [paragraph, bulletPoints, headline, sectionWise] = await Promise.all([
    generateSummary({ content, format: "paragraph", title }),
    generateSummary({ content, format: "bullet-points", title }),
    generateSummary({ content, format: "headline", title }),
    generateSummary({ content, format: "section-wise", title }),
  ]);

  return { paragraph, bulletPoints, headline, sectionWise };
}
