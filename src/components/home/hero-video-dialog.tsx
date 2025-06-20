import HeroVideoDialog from "@/components/magicui/hero-video-dialog";

export function HomeSectionHeroVideoDialog() {
  return (
    <div className="relative my-20 xl:-mx-20 ">
      <HeroVideoDialog
        className="block dark:hidden "
        animationStyle="from-center"
        videoSrc="https://www.youtube.com/embed/lXCbp4P7o14?si=_DVIrOpm0pwasYUM"
        thumbnailSrc="/screenshot.png"
        thumbnailAlt="Hero Video"
      />
      <HeroVideoDialog
        className="hidden dark:block"
        animationStyle="from-center"
        videoSrc="https://www.youtube.com/embed/lXCbp4P7o14?si=_DVIrOpm0pwasYUM"
        thumbnailSrc="/screenshot.png"
        thumbnailAlt="Hero Video"
      />
    </div>
  );
}
