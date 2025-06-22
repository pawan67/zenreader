import HeroVideoDialog from "@/components/magicui/hero-video-dialog";

export function HomeSectionHeroVideoDialog() {
  return (
    <div className="relative my-20 xl:-mx-20 ">
      <HeroVideoDialog
        className="block dark:hidden "
        animationStyle="from-center"
        videoSrc="cursorful-video-1750593924119.mp4"
        thumbnailSrc="/screenshot.png"
        thumbnailAlt="Hero Video"
      />
      <HeroVideoDialog
        className="hidden dark:block"
        animationStyle="from-center"
        videoSrc="cursorful-video-1750593924119.mp4"
        thumbnailSrc="/screenshot.png"
        thumbnailAlt="Hero Video"
      />
    </div>
  );
}
