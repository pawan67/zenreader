import { create } from "zustand";
import { StateCreator } from "zustand";

interface FontState {
  fontSize: number;
  fontFamily: string;
  setFontSize: (size: number) => void;
  setFontFamily: (family: string) => void;
}

export const useFontStore = create<FontState>(
  (set: (partial: Partial<FontState>) => void) => ({
    fontSize: 16,
    fontFamily: "font-sans",
    setFontSize: (fontSize: number) => set({ fontSize }),
    setFontFamily: (fontFamily: string) => set({ fontFamily }),
  })
);

export type { FontState };
