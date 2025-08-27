import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface BibleState {
  activeBook: string;
  activeBookShort: string;
  activeChapter: number;
  activeVerse: number;
  bibleVersion: string;
  setActiveBook: (activeBook: string) => void;
  setActiveBookOnly: (activeBook: string) => void;
  setActiveBookShort: (activeBookShort: string) => void;
  setActiveChapter: (activeChapter: number) => void;
  setActiveVerse: (activeVerse: number) => void;
  setBibleVersion: (bibleVersion: string) => void;
}

export const useBibleStore = create<BibleState>()(
  persist(
    (set) => ({
      activeBook: "Genesis",
      activeBookShort: "Gen",
      activeChapter: 1,
      activeVerse: 1,
      bibleVersion: "KJV",
      setActiveBook: (activeBook) => set({ activeBook, activeChapter: 1 }),
      setActiveBookOnly: (activeBook) => set({ activeBook }),
      setActiveBookShort: (activeBookShort) => set({ activeBookShort }),
      setActiveChapter: (activeChapter) => set({ activeChapter }),
      setActiveVerse: (activeVerse) => {
        set({ activeVerse });
        document
          .getElementById("verse-" + activeVerse)
          ?.scrollIntoView({ block: "center", behavior: "smooth" });
      },
      setBibleVersion: (bibleVersion) => set({ bibleVersion }),
    }),
    {
      name: "bible-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
