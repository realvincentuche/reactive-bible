import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface BibleState {
  activeBook: string;
  activeBookShort: string;
  activeChapter: number;
  activeVerses: number[];
  setActiveBook: (activeBook: string) => void;
  setActiveBookOnly: (activeBook: string) => void;
  setActiveBookShort: (activeBookShort: string) => void;
  setActiveChapter: (activeChapter: number) => void;
  setActiveVerses: (activeVerses: number[]) => void;
}

export const useBibleStore = create<BibleState>()(
  persist(
    (set) => ({
      activeBook: "Genesis",
      activeBookShort: "Gen",
      activeChapter: 1,
      activeVerses: [1],
      setActiveBook: (activeBook) => set({ activeBook, activeChapter: 1 }),
      setActiveBookOnly: (activeBook) => set({ activeBook }),
      setActiveBookShort: (activeBookShort) => set({ activeBookShort }),
      setActiveChapter: (activeChapter) => set({ activeChapter }),
      setActiveVerses: (activeVerses) => {
        set({ activeVerses });
        activeVerses.forEach((verse) => {
          document
            .getElementById("verse-" + verse)
            ?.scrollIntoView({ block: "center", behavior: "smooth" });
        });
      },
    }),
    {
      name: "bible-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
