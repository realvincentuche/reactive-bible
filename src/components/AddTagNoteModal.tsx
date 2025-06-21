import { Modal, Button, Select, TextInput } from "@mantine/core";
import { addTagNote } from '../api';
import { useBibleStore } from "../store";
import { useState } from 'react';

interface AddTagNoteModalProps {
  opened: boolean;
  onClose: () => void;
}

const AddTagNoteModal = ({ opened, onClose }: AddTagNoteModalProps) => {
  const [tagId, setTagId] = useState('');
  const [tagNoteText, setTagNoteText] = useState('');
  const activeVerses = useBibleStore((state) => state.activeVerses);
  const activeBook = useBibleStore((state) => state.activeBook);
  const activeChapter = useBibleStore((state) => state.activeChapter);
  const tags = ["TAG9EB8F0ABC2454FC", "TAG7BFDDCD8A94E416", "TAGEFF4B88401074BE"]

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Tag ID:", tagId);
    console.log("Tag Note Text:", tagNoteText);
    console.log("Selected Verses:", activeVerses);

    const verseReferences = activeVerses.map((verse) => ({
      book: activeBook,
      chapter: activeChapter,
      verse,
    }));
    try {
      const data = await addTagNote(tagId, tagNoteText, verseReferences);
      console.log('Tag note added:', data);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Tag">
      <form onSubmit={handleSubmit}>
        <Select
          label="Tag"
          value={tagId}
          onChange={(item) => setTagId(item)}
          data={tags}
        />
        <TextInput
          label="Note"
          value={tagNoteText}
          onChange={(event) => setTagNoteText(event.currentTarget.value)}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Modal>
  );
};

export default AddTagNoteModal;
