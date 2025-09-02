import { useBibleStore } from "../store";
import { getVersesInChapter } from "../api";
import { Box, ScrollArea } from "@mantine/core";
import { useRef } from "react";
import SubHeader from "./SubHeader";
import Verse from "./Verse";

const Passage = ({ open }: { open: () => void  }) => {
  const viewport = useRef<HTMLDivElement>(null);
  const activeBook = useBibleStore((state) => state.activeBook);
  const activeChapter = useBibleStore((state) => state.activeChapter);
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
          {getVersesInChapter(activeBook, activeChapter).map(
            ({ verse, text }) => (
              <Verse verse={verse} key={verse} text={text} />
            )
          )}
        </ScrollArea>
      </Box>
    </Box>
  );
};

export default Passage;
