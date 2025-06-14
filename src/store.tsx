import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface BibleState {
  activeBook: string;
  activeBookShort: string;
  activeChapter: number;
  activeVerses: number[];
  tagNoteTitle: string;
  tagNoteText: string;
  setActiveBook: (activeBook: string) => void;
  setActiveBookOnly: (activeBook: string) => void;
  setActiveBookShort: (activeBookShort: string) => void;
  setActiveChapter: (activeChapter: number) => void;
  setActiveVerses: (activeVerses: number[]) => void;
  setTagNoteTitle: (tagNoteTitle: string) => void;
  setTagNoteText: (tagNoteText: string) => void;
  addTagNote: (
    tagNoteTitle: string,
    tagNoteText: string,
    selectedVerses: any
  ) => void;
  selectedVerses: number[];
}

export const useBibleStore = create<BibleState>()(
  persist(
    (set) => ({
      activeBook: "Genesis",
      activeBookShort: "Gen",
      activeChapter: 1,
      activeVerses: [1],
      tagNoteTitle: "",
      tagNoteText: "",
      selectedVerses: [],
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
      setTagNoteTitle: (tagNoteTitle) => set({ tagNoteTitle }),
      setTagNoteText: (tagNoteText) => set({ tagNoteText }),
      addTagNote: (tagNoteTitle, tagNoteText, selectedVerses) => {
        console.log("Tag Note Title:", tagNoteTitle);
        console.log("Tag Note Text:", tagNoteText);
        console.log("Selected Verses:", selectedVerses);
      },
    }),
    {
      name: "bible-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
