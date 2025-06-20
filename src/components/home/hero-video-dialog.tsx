import HeroVideoDialog from "@/components/magicui/hero-video-dialog";

export function HomeSectionHeroVideoDialog() {
  return (
    <div className="relative my-20 xl:-mx-20 ">
      <HeroVideoDialog
        className="block dark:hidden "
        animationStyle="from-center"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="/screenshot-light.png"
        thumbnailAlt="Hero Video"
      />
      <HeroVideoDialog
        className="hidden dark:block"
        animationStyle="from-center"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="/screenshot-dark.png"
        thumbnailAlt="Hero Video"
      />
    </div>
  );
}
