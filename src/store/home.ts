import { create } from "zustand";

interface HomeState {
  title: string;
  content: string;
  excerpt: string;
  byline: string;
  siteName: string;
  lang: string;
  publishedTime: string;
  loading: boolean;
  setAll: (data: Partial<HomeState>) => void;
  reset: () => void;
  words: number;
  timeToRead: number;
}

const initialState = {
  title: "",
  content: "",
  excerpt: "",
  byline: "",
  siteName: "",
  lang: "",
  publishedTime: "",
  loading: false,
  words: 0,
  timeToRead: 0,
};

export const useHomeStore = create<HomeState>((set) => ({
  ...initialState,
  setAll: (data) => set((state) => ({ ...state, ...data })),
  reset: () => set(initialState),
}));
