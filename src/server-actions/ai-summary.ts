"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export type SummaryLength = "short" | "medium" | "long";

interface SummaryRequest {
  content: string;
  length: SummaryLength;
  title?: string;
}

interface SummaryResponse {
  summary: string;
  wordCount: number;
  length: SummaryLength;
  error?: string;
}

const getLengthInstructions = (length: SummaryLength): string => {
  switch (length) {
    case "short":
      return "Create a very concise summary in 50 words or less. Focus on the most essential points only.";
    case "medium":
      return "Create a medium-length summary in 100 words or less. Include key points and main ideas.";
    case "long":
      return "Create a comprehensive summary in 150 words or less. Include detailed points while maintaining clarity.";
    default:
      return "Create a balanced summary.";
  }
};

export async function generateSummary({
  content,
  length,
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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create the prompt
    const lengthInstructions = getLengthInstructions(length);
    const prompt = `
You are an expert content summarizer. Please summarize the following content according to these requirements:

${lengthInstructions}

Content to summarize:
${title ? `Title: ${title}\n\n` : ""}${content}

Please provide only the summary text without any additional formatting, explanations, or meta-commentary. Make sure the summary is well-structured and easy to read.
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
      length,
    };
  } catch (error) {
    console.error("Error generating summary:", error);
    return {
      summary: "",
      wordCount: 0,
      length,
      error:
        error instanceof Error ? error.message : "Failed to generate summary",
    };
  }
}

// Helper function to get summary with specific word limits
export async function getSummaryWithLimit(
  content: string,
  maxWords: number,
  title?: string
): Promise<SummaryResponse> {
  let length: SummaryLength;

  if (maxWords <= 50) {
    length = "short";
  } else if (maxWords <= 100) {
    length = "medium";
  } else {
    length = "long";
  }

  return generateSummary({ content, length, title });
}

// Batch summary generation for multiple lengths
export async function generateMultiLengthSummary(
  content: string,
  title?: string
): Promise<{
  short: SummaryResponse;
  medium: SummaryResponse;
  long: SummaryResponse;
}> {
  const [short, medium, long] = await Promise.all([
    generateSummary({ content, length: "short", title }),
    generateSummary({ content, length: "medium", title }),
    generateSummary({ content, length: "long", title }),
  ]);

  return { short, medium, long };
}
