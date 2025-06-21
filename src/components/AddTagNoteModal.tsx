import { Modal, Button, Select, TextInput } from "@mantine/core";
import { addTagNote } from "../api";
import { useBibleStore } from "../store";
import { useState, useEffect } from "react";

interface AddTagNoteModalProps {
  opened: boolean;
  onClose: () => void;
}

const AddTagNoteModal = ({ opened, onClose }: AddTagNoteModalProps) => {
  const [tags, setTags] = useState([]);
  const [selectedTagId, setSelectedTagId] = useState("");
  const [selectedTagName, setSelectedTagName] = useState("");
  const [tagNoteText, setTagNoteText] = useState("");
  const activeVerses = useBibleStore((state) => state.activeVerses);
  const activeBook = useBibleStore((state) => state.activeBook);
  const activeChapter = useBibleStore((state) => state.activeChapter);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(
          "https://bible-research.vercel.app/api/v1/tags/"
        );
        const data = await response.json();
        setTags(
          data.map((item, index) => ({
            id: item.id,
            name: item.name,
            key: index,
          }))
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchTags();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const verseReferences = activeVerses.map((verse) => ({
      book: activeBook,
      chapter: activeChapter,
      verse,
    }));
    try {
      const data = await addTagNote(
        selectedTagId,
        tagNoteText,
        verseReferences
      );
      console.log("Tag note added:", data);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      variant="transparent"
      opened={opened}
      onClose={onClose}
      title="Add tag to selected verses"
    >
      <form onSubmit={handleSubmit}>
        <Select
          variant="transparent"
          label="Tag"
          value={selectedTagName}
          onChange={(item) => {
            setSelectedTagId(tags.find((tag) => tag.name === item).id);
            setSelectedTagName(item);
          }}
          data={tags.map((tag) => tag.name)}
        />
        <TextInput
          variant="transparent"
          label="Note"
          value={tagNoteText}
          onChange={(event) => setTagNoteText(event.currentTarget.value)}
        />
        <Button variant="transparent" type="submit">
          Submit
        </Button>
      </form>
    </Modal>
  );
};

export default AddTagNoteModal;
