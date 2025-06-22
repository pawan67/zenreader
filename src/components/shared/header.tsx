"use client";

import { Icon } from "@iconify/react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import FontSizeChanger from "./font-size";
import FontStyleChanger from "./font-style";
import { useEffect, useState } from "react";
import { ModeToggle } from "./theme-toggle";
import { useHomeStore } from "@/store/home";

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { title, content, reset } = useHomeStore();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show header at the top of the page
      if (currentScrollY <= 50) {
        setIsVisible(true);
      } else {
        // Hide when scrolling down, show when scrolling up
        setIsVisible(currentScrollY < lastScrollY);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between max-w-4xl mx-auto px-5 py-4">
        <div className="flex items-center gap-2">
          {title && content ? (
            <Button
              variant="outline"
              size="icon"
              className="mr-2 rounded-full"
              aria-label="Back to URL input"
              onClick={() => {
                reset();
                window.dispatchEvent(new CustomEvent("zenreader:back"));
              }}
            >
              <Icon icon="tabler:arrow-left" width="24" height="24" />
            </Button>
          ) : (
            <Icon icon="stash:article-alt-duotone" width="32" height="32" />
          )}
        </div>

        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className=" rounded-full size-10 hover:bg-muted"
                size="icon"
              >
                <Icon icon="weui:setting-filled" width="40" height="40" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
              <FontSizeChanger />
              <FontStyleChanger />

              <div className="flex items-center gap-2 mt-5">
                <span className="text-sm">Theme:</span>
                <ModeToggle />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
};

export default Header;
