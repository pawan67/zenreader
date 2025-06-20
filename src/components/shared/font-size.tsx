import { useFontStore } from "@/store/font";
import type { FontState } from "@/store/font";
import { Button } from "@/components/ui/button";

const FontSizeChanger = () => {
  const fontSize = useFontStore((state: FontState) => state.fontSize);
  const setFontSize = useFontStore((state: FontState) => state.setFontSize);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">Font Size:</span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setFontSize(fontSize - 1)}
        disabled={fontSize <= 12}
        aria-label="Decrease font size"
      >
        -
      </Button>
      <span className="w-8 text-center">{fontSize}px</span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setFontSize(fontSize + 1)}
        disabled={fontSize >= 32}
        aria-label="Increase font size"
      >
        +
      </Button>
    </div>
  );
};

export default FontSizeChanger;
