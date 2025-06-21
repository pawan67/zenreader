import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useHomeStore } from "@/store/home";
import { useFontStore } from "@/store/font";
import { ScrollProgress } from "../magicui/scroll-progress";
import { Badge } from "../ui/badge";
import { useState } from "react";
import Summary from "./summary";
import { BorderBeam } from "../magicui/border-beam";

const Reader = () => {
  const {
    title,
    content,
    excerpt,
    byline,
    siteName,
    lang,
    publishedTime,
    words,
    timeToRead,
  } = useHomeStore();
  const fontSize = useFontStore((state) => state.fontSize);
  const fontFamily = useFontStore((state) => state.fontFamily);
  const [showSummary, setShowSummary] = useState(false);

  return (
    <div className="mt-6 max-w-3xl mx-auto">
      <div className="">
        <h1 className="text-2xl font-bold mb-0 flex-1">{title}</h1>
        <div className=" flex items-center gap-2 flex-wrap mt-2">
          {byline && (
            <Badge>
              <Icon icon="tabler:user" width="16" height="16" />
              {byline}
            </Badge>
          )}
          {siteName && (
            <Badge variant="secondary">
              <Icon icon="tabler:world" width="16" height="16" />
              {siteName}
            </Badge>
          )}

          {lang && (
            <Badge variant="secondary">
              <Icon icon="tabler:language" width="16" height="16" />
              {lang}
            </Badge>
          )}

          {timeToRead && (
            <Badge variant="secondary">
              <Icon icon="tabler:clock" width="16" height="16" />
              {timeToRead} min read
            </Badge>
          )}
        </div>
        {publishedTime && (
          <p className="text-sm mt-2 text-muted-foreground">
            Published on {new Date(publishedTime).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* AI Summary Section */}
      <div className="mt-8 ">
        <Button
          variant="outline"
          onClick={() => setShowSummary(!showSummary)}
          className="w-full justify-between rounded-xl h-14 relative"
          size="lg"
        >
          <BorderBeam duration={10} />

          <span className="flex items-center gap-2">
            <Icon icon="material-icon-theme:gemini-ai" width="16" height="16" />{" "}
            <span className="flex items-center gap-2">
              <span>AI Summary</span>
              <span className="text-xs text-muted-foreground">
                Powered by Gemini
              </span>
            </span>
          </span>
          <Icon
            icon={showSummary ? "tabler:chevron-up" : "tabler:chevron-down"}
            className="h-4 w-4"
          />
        </Button>

        {showSummary && (
          <div className="mt-4">
            <Summary content={content} title={title} />
          </div>
        )}
      </div>

      <article
        className={`prose prose-lg max-w-3xl mt-8 dark:prose-invert ${fontFamily}`}
        style={{
          fontSize: fontSize + "px",
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </article>
    </div>
  );
};

export default Reader;
