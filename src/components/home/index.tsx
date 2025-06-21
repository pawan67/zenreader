"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useEffect } from "react";
import { HomeSectionHeroVideoDialog } from "./hero-video-dialog";
import { AuroraText } from "../magicui/aurora-text";
import { useFontStore } from "@/store/font";
import Reader from "./reader";
import { useHomeStore } from "@/store/home";
import { BorderBeam } from "../magicui/border-beam";

const Home = () => {
  const urlState = useState("");
  const [url, setUrl] = urlState;
  const title = useHomeStore((state) => state.title);
  const content = useHomeStore((state) => state.content);
  const loading = useHomeStore((state) => state.loading);
  const setAll = useHomeStore((state) => state.setAll);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAll({ loading: true });
    const res = await fetch("/api/parse", {
      method: "POST",
      body: JSON.stringify({ url }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setAll({
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      byline: data.byline,
      siteName: data.siteName,
      lang: data.lang,
      publishedTime: data.publishedTime,
      loading: false,
      words: data.words,
      timeToRead: data.timeToRead,
    });
  };

  useEffect(() => {
    const handler = () => setUrl("");
    window.addEventListener("zenreader:back", handler);
    return () => window.removeEventListener("zenreader:back", handler);
  }, []);

  if (title && content) {
    return (
      <div className="p-5 max-w-4xl mx-auto">
        <Reader />
      </div>
    );
  }

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <div className=" mt-20 text-center relative">
        <Icon
          className=" absolute right-0 -top-10"
          icon="material-icon-theme:gemini-ai"
          width="50"
          height="50"
        />
        <h1 className=" scroll-m-20 text-center text-5xl md:text-6xl font-extrabold tracking-tight text-balance">
          Read Without Distractions.
        </h1>

        <p className=" leading-7 text-muted-foreground [&:not(:first-child)]:mt-3">
          ZenReader transforms any article into a clean, distraction-free format
          <br /> Now with AI summaries to save your time.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className=" mt-10 max-w-xl mx-auto flex gap-2"
      >
        <div className=" rounded-full  relative w-full">
          <Input
            type="url"
            placeholder="https://www.example.com/blog"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-2 border h-14 pr-14 rounded-full pl-5"
            required
          />

          <Button
            className=" cursor-pointer absolute h-10 w-10 right-2 rounded-full top-1/2 -translate-y-1/2 "
            type="submit"
            size="icon"
            disabled={!url || loading}
          >
            {loading && (
              <Icon
                icon="tabler:loader-2"
                width="24"
                height="24"
                className="animate-spin"
              />
            )}
            {!loading && (
              <Icon icon="tabler:arrow-right" width="24" height="24" />
            )}
          </Button>
        </div>
      </form>

      <HomeSectionHeroVideoDialog />
    </div>
  );
};

export default Home;
