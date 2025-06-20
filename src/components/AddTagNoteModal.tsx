import { Modal, Button, Select, TextInput } from "@mantine/core";
import { addTagNote } from '../api';
import { useBibleStore } from "../store";

interface AddTagNoteModalProps {
  opened: boolean;
  onClose: () => void;
}

const AddTagNoteModal = ({ opened, onClose }: AddTagNoteModalProps) => {
  const tagNoteTitle = useBibleStore((state) => state.tagNoteTitle);
  const tagNoteText = useBibleStore((state) => state.tagNoteText);
  const setTagNoteTitle = useBibleStore((state) => state.setTagNoteTitle);
  const setTagNoteText = useBibleStore((state) => state.setTagNoteText);
  const activeVerses = useBibleStore((state) => state.activeVerses);
  const activeBook = useBibleStore((state) => state.activeBook);
  const activeChapter = useBibleStore((state) => state.activeChapter);
  const titles = ["TAG9EB8F0ABC2454FC", "TAG7BFDDCD8A94E416", "TAGEFF4B88401074BE"]

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Tag Note Title:", tagNoteTitle);
    console.log("Tag Note Text:", tagNoteText);
    console.log("Selected Verses:", activeVerses);

    const verseReferences = activeVerses.map((verse) => ({
      book: activeBook,
      chapter: activeChapter,
      verse,
    }));
    try {
      const data = await addTagNote(tagNoteTitle, tagNoteText, verseReferences);
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
          label="Tag Note Title"
          value={tagNoteTitle}
          onChange={(item) => setTagNoteTitle(item)}
          data={titles}
        />
        <TextInput
          label="Tag Note Text"
          value={tagNoteText}
          onChange={(event) => setTagNoteText(event.currentTarget.value)}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Modal>
  );
};

export default AddTagNoteModal;
