import { useFontStore } from "@/store/font";
import type { FontState } from "@/store/font";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const FONT_FAMILIES = [
  { label: "Default", value: "font-sans" },
  { label: "Roboto", value: "font-roboto" },
  { label: "Serif", value: "font-pt-serif" },
  { label: "Monospace", value: "font-mono" },
  { label: "Inter", value: "font-inter" },
];

const FontStyleChanger = () => {
  const fontFamily = useFontStore((state: FontState) => state.fontFamily);
  const setFontFamily = useFontStore((state: FontState) => state.setFontFamily);

  return (
    <div className="flex items-center gap-2 mt-5">
      <span className="text-sm">Font Style:</span>
      <Select value={fontFamily} onValueChange={setFontFamily}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {FONT_FAMILIES.map((font) => (
            <SelectItem key={font.value} value={font.value}>
              {font.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FontStyleChanger;
