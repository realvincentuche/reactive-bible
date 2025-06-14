import { Modal, Button, Select, TextInput } from "@mantine/core";
import { useState } from "react";
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
  const addTagNote = useBibleStore((state) => state.addTagNote);
  const titles = useBibleStore((state) => ["Title 1", "Title 2", "Title 3"]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTagNote(tagNoteTitle, tagNoteText);
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Tag">
      <form onSubmit={handleSubmit}>
        <Select
          label="Tag Note Title"
          value={tagNoteTitle}
          onChange={(event) => setTagNoteTitle(event.currentTarget.value)}
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
