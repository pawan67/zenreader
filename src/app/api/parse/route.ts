import { NextRequest, NextResponse } from "next/server";
import { load } from "cheerio";
import { Readability } from "@paoramen/cheer-reader";

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
        Connection: "keep-alive",
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        return NextResponse.json(
          {
            error:
              "Access Denied: This website blocks automated readers. Try another link.",
          },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { error: `Failed to fetch article: ${response.statusText}` },
        { status: response.status }
      );
    }

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
