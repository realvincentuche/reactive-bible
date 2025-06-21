import bibleJson from "./assets/kjv.json";

export const data = bibleJson as Book[];

export interface Book {
  chapter: number;
  verse: number;
  text: string;
  translation_id: string;
  book_id: string;
  book_name: string;
}

export const getBooks = (): { book_name: string; book_id: string }[] => {
  const set = new Set<string>();
  data.map((book: Book) => {
    const obj = {
      book_name: book.book_name,
      book_id: book.book_id,
    };
    set.add(JSON.stringify(obj, Object.keys(obj).sort()));
  });
  return [...set].map((item) => {
    if (typeof item === "string") return JSON.parse(item);
    else if (typeof item === "object") return item;
  }) as {
    book_name: string;
    book_id: string;
  }[];
};

export const getChapters = (thebook: string): number[] => {
  return [
    ...new Set<number>(
      data
        .filter((book: Book) => book.book_name === thebook)
        .map((book: Book) => book.chapter)
    ),
  ];
};

export const getVerses = (thebook: string, thechapter: number): number[] => {
  return data
    .filter(
      (book: Book) => book.book_name === thebook && book.chapter === thechapter
    )
    .map((book: Book) => book.verse);
};

export const getVersesInChapter = (
  thebook: string,
  thechapter: number
): { verse: number; text: string }[] => {
  return data
    .filter(
      (book: Book) => book.book_name === thebook && book.chapter === thechapter
    )
    .map((book: Book) => ({ verse: book.verse, text: book.text }));
};

export const getPassage = (): {
  book_name: string;
  book_id: string;
  chapter: number;
}[] => {
  const set = new Set<string>();
  data.map((book: Book) => {
    const obj = {
      book_name: book.book_name,
      book_id: book.book_id,
      chapter: book.chapter,
    };
    set.add(JSON.stringify(obj, Object.keys(obj).sort()));
  });
  return [...set].map((item) => {
    if (typeof item === "string") return JSON.parse(item);
    else if (typeof item === "object") return item;
  }) as {
    book_name: string;
    book_id: string;
    chapter: number;
  }[];
};

export const addTagNote = async (
  tagId: string,
  tagNoteText: string,
  verseReferences: { book: string; chapter: number; verse: number }[]
) => {
  const body = JSON.stringify({
    tag: tagId,
    note_text: tagNoteText,
    verse_references: verseReferences,
  })

  try {
    const response = await fetch('http://127.0.0.1:8000/api/v1/notes/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};
