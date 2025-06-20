import { NextRequest, NextResponse } from "next/server";
import { load } from "cheerio";
import { Readability } from "@paoramen/cheer-reader";

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();

    // Use Cheerio to parse HTML
    const $ = load(html, { xmlMode: false });

    // Use cheer-reader for advanced readability
    const reader = new Readability($);
    const article = reader.parse();

    if (!article) {
      return NextResponse.json(
        { error: "Failed to extract article" },
        { status: 500 }
      );
    }

    const wordCount = article.textContent?.split(/\s+/).length ?? 0;
    const timeToRead = Math.ceil(wordCount / 200); // in minutes

    return NextResponse.json({
      content: article.content,
      title: article.title,
      excerpt: article.excerpt,
      byline: article.byline,
      siteName: article.siteName,
      lang: article.lang,
      publishedTime: article.publishedTime,
      words: wordCount,
      timeToRead,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to parse article" },
      { status: 500 }
    );
  }
}
