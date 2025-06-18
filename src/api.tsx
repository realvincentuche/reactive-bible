import bibleJson from "./assets/kjv.json";

export const data = bibleJson as KjvBook[];

export interface KjvBook {
  chapter: number;
  verse: number;
  text: string;
  translation_id: string;
  book_id: string;
  book_name: string;
}

export const getBooks = (): { book_name: string; book_id: string }[] => {
  const set = new Set<string>();
  data.map((book: KjvBook) => {
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
        .filter((book: KjvBook) => book.book_name === thebook)
        .map((book: KjvBook) => book.chapter)
    ),
  ];
};

export const getVerses = (thebook: string, thechapter: number): number[] => {
  return data
    .filter(
      (book: KjvBook) => book.book_name === thebook && book.chapter === thechapter
    )
    .map((book: KjvBook) => book.verse);
};

export const getVersesInChapter = async (
  thebook: string,
  thechapter: number,
  bibleVersion: string
): Promise<{ verse: number; text: string }[]> => {
  if (bibleVersion === 'KJV') {
    return getVersesInKjvChapter(thebook, thechapter);
  } else if (bibleVersion === 'ESV') {
    return await getVersesInEsvChapter(thebook, thechapter);
  } else {
    throw new Error(`Unsupported Bible version: ${bibleVersion}`);
  }
};

export const getVersesInKjvChapter = (
  thebook: string,
  thechapter: number
): { verse: number; text: string }[] => {
  return data
    .filter(
      (book: KjvBook) => book.book_name === thebook && book.chapter === thechapter
    )
    .map((book: KjvBook) => ({ verse: book.verse, text: book.text }));
};

export const getVersesInEsvChapter = async (
  thebook: string,
  thechapter: number
): Promise<{ verse: number; text: string }[]> => {
  try {
    const passage = `${thebook} ${thechapter}`;
    const url = `https://tedisrozenfelds.vercel.app/bible/verses?passage=${passage}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    const verses = data.verses
  return Promise.resolve(verses.map((verse) => ({ verse: verse.verse, text: verse.text })));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getPassage = (): {
  book_name: string;
  book_id: string;
  chapter: number;
}[] => {
  const set = new Set<string>();
  data.map((book: KjvBook) => {
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
