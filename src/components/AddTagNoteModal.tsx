import { Modal, Button, Select, TextInput } from "@mantine/core";
import { addTagNote } from '../api';
import { useBibleStore } from "../store";
import { useState, useEffect } from 'react';

interface AddTagNoteModalProps {
  opened: boolean;
  onClose: () => void;
}

const AddTagNoteModal = ({ opened, onClose }: AddTagNoteModalProps) => {
  const [tags, setTags] = useState([]);
  const [selectedTagId, setSelectedTagId] = useState('');
  const [selectedTagName, setSelectedTagName] = useState('');
  const [tagNoteText, setTagNoteText] = useState('');
  const activeVerses = useBibleStore((state) => state.activeVerses);
  const activeBook = useBibleStore((state) => state.activeBook);
  const activeChapter = useBibleStore((state) => state.activeChapter);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/tags/');
        const data = await response.json();
        setTags(data.map((item, index) => ({ id: item.id, name: item.name, key: index })));
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
      const data = await addTagNote(selectedTagId, tagNoteText, verseReferences);
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
          value={selectedTagName}
          onChange={(item) => {
            setSelectedTagId(tags.find(tag => tag.name === item).id);
            setSelectedTagName(item)
          }}
          data={tags.map(tag => tag.name)}
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
