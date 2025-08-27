import { ActionIcon, Box, Title, rem, Modal } from "@mantine/core";
import {
  IconArrowLeft,
  IconArrowRight,
  IconSearch,
  IconNotes,
  IconTag,
} from "@tabler/icons-react";
import { useState } from "react";
import { useBibleStore } from "../store";
import { getPassage } from "../api";
import Audio from "./Audio";
import NoteManager from "./Note";
import TagManager from "./Tag"; 

const SubHeader = ({ open }: { open: () => void }) => {
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  
  const activeChapter = useBibleStore((state) => state.activeChapter);
  const activeBookShort = useBibleStore((state) => state.activeBookShort);
  const activeBook = useBibleStore((state) => state.activeBook);
  const setActiveBookOnly = useBibleStore((state) => state.setActiveBookOnly);
  const setActiveBookShort = useBibleStore((state) => state.setActiveBookShort);
  const setActiveChapter = useBibleStore((state) => state.setActiveChapter);
  const getPassageResult = getPassage();
  
  const checkNext = (): number | null => {
    const index = getPassageResult.findIndex(
      (book) => book.book_name === activeBook && book.chapter === activeChapter
    );
    return index === -1 || index === getPassageResult.length - 1 ? null : index;
  };
  
  const checkPrev = (): number | null => {
    const index = getPassageResult.findIndex(
      (book) => book.book_name === activeBook && book.chapter === activeChapter
    );
    return index === -1 || index === 0 ? null : index;
  };
  
  const nextHandler = () => {
    const index = checkNext();
    if (index === null) return null;
    if (getPassageResult) {
      const next = getPassageResult[index + 1];
      if (next !== null) {
        setActiveBookOnly(next.book_name);
        setActiveBookShort(next.book_id);
        setActiveChapter(next.chapter);
      }
    }
  };
  
  const prevHandler = () => {
    const index = checkPrev();
    if (index === null) return null;
    if (getPassageResult) {
      const prev = getPassageResult[index - 1];
      if (prev !== null) {
        setActiveBookOnly(prev.book_name);
        setActiveBookShort(prev.book_id);
        setActiveChapter(prev.chapter);
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          height: rem(15),
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        mb={20}
      >
        <ActionIcon
          variant="transparent"
          onClick={prevHandler}
          disabled={checkPrev() === null}
          title="prev-passage-button"
        >
          <IconArrowLeft size={rem(20)} />
        </ActionIcon>
        
        <ActionIcon variant="transparent" onClick={open}>
          <IconSearch size={rem(20)} />
        </ActionIcon>
        
        <Title order={4}>
          {activeBookShort} {activeChapter}
        </Title>
        
        <ActionIcon
          variant="transparent"
          onClick={() => setNoteModalOpen(true)}
          title="Open Notes"
        >
          <IconNotes size={rem(20)} />
        </ActionIcon>
        
        <ActionIcon
          variant="transparent"
          onClick={() => setTagModalOpen(true)}
          title="Open Tags"
        >
          <IconTag size={rem(20)} />
        </ActionIcon>
        
        <Audio />
        
        <ActionIcon
          variant="transparent"
          onClick={nextHandler}
          disabled={checkNext() === null}
          title="next-passage-button"
        >
          <IconArrowRight size={rem(20)} />
        </ActionIcon>
      </Box>

      <Modal
        opened={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        title={`Notes for ${activeBookShort} ${activeChapter}`}
        size="xl"
        centered
      >
        <NoteManager />
      </Modal>

      <Modal
        opened={tagModalOpen}
        onClose={() => setTagModalOpen(false)}
        title="Tag Management"
        size="xl"
        centered
      >
        <TagManager />
      </Modal>
    </>
  );
};

export default SubHeader;