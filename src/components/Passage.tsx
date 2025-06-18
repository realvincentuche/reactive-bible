import { useBibleStore } from "../store";
import { getVersesInChapter } from "../api";
import { Box, ScrollArea } from "@mantine/core";
import { useState, useEffect, useRef } from "react";
import SubHeader from "./SubHeader";
import Verse from "./Verse";

const Passage = ({ open }: { open: () => void  }) => {
  const viewport = useRef<HTMLDivElement>(null);
  const activeBook = useBibleStore((state) => state.activeBook);
  const activeChapter = useBibleStore((state) => state.activeChapter);
  const bibleVersion = useBibleStore((state) => state.bibleVersion);
  const [verses, setVerses] = useState([]);

  useEffect(() => {
    getVersesInChapter(activeBook, activeChapter, bibleVersion)
      .then((result) => setVerses(result))
      .catch((error) => console.error(error));
  }, [activeBook, activeChapter, bibleVersion]);

  return (
    <Box style={{ flex: "1 0 100%" }}>
      <SubHeader open={open} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        h="80vh"
      >
        <ScrollArea h="80vh" viewportRef={viewport}>
          {verses.map((verse) => (
            <Verse verse={verse.verse} key={verse.verse} text={verse.text} />
          ))}
        </ScrollArea>
      </Box>
    </Box>
  );
};

export default Passage;
