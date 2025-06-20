import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useHomeStore } from "@/store/home";
import { useFontStore } from "@/store/font";
import { ScrollProgress } from "../magicui/scroll-progress";
import { Badge } from "../ui/badge";

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

  return (
    <div className="mt-6">
      <ScrollProgress className="bottom-0" />
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
