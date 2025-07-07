import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextInput,
  Textarea,
  Select,
  Modal,
  Group,
  Stack,
  Text,
  Card,
  Badge,
  ActionIcon,
  LoadingOverlay,
  Alert,
  Divider,
  ScrollArea,
} from '@mantine/core';
import { IconPlus, IconEdit, IconTrash, IconSearch } from '@tabler/icons-react';
import { useBibleStore } from '../store';

// Type definitions based on your data structure
interface Verse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
}

interface Tag {
  id: string;
  name: string;
  parent_tag: string | null;
  created_at: string;
  updated_at: string;
}

interface Note {
  id: string;
  note_text: string;
  created_at: string;
  updated_at: string;
  tag: Tag | null;
  verses: Verse[];
}

interface CreateNoteRequest {
  note_text: string;
  tag_id?: string;
  verses?: Array<{
    book: string;
    chapter: number;
    verse: number;
  }>;
}

interface UpdateNoteRequest {
  note_text?: string;
  tag_id?: string;
  verses?: Array<{
    book: string;
    chapter: number;
    verse: number;
  }>;
}

// API functions
const API_BASE_URL = 'https://bible-research.vercel.app/api/v1';

const noteAPI = {
  // Get all notes
  getAllNotes: async (): Promise<Note[]> => {
    const response = await fetch(`${API_BASE_URL}/notes`);
    if (!response.ok) throw new Error('Failed to fetch notes');
    return response.json();
  },

  // Get note by ID
  getNote: async (id: string): Promise<Note> => {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`);
    if (!response.ok) throw new Error('Failed to fetch note');
    return response.json();
  },

  // Create new note
  createNote: async (noteData: CreateNoteRequest): Promise<Note> => {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    });
    if (!response.ok) throw new Error('Failed to create note');
    return response.json();
  },

  // Update note
  updateNote: async (id: string, noteData: UpdateNoteRequest): Promise<Note> => {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    });
    if (!response.ok) throw new Error('Failed to update note');
    return response.json();
  },

  // Delete note
  deleteNote: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete note');
  },

  // Get all tags
  getAllTags: async (): Promise<Tag[]> => {
    const response = await fetch(`${API_BASE_URL}/tags`);
    if (!response.ok) throw new Error('Failed to fetch tags');
    return response.json();
  },
};

const NoteManager: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  
  const [noteText, setNoteText] = useState('');
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [verseBook, setVerseBook] = useState('');
  const [verseChapter, setVerseChapter] = useState<number | ''>('');
  const [verseNumber, setVerseNumber] = useState<number | ''>('');

  const activeBook = useBibleStore((state) => state.activeBook);
  const activeChapter = useBibleStore((state) => state.activeChapter);

  useEffect(() => {
    loadNotes();
    loadTags();
  }, []);

  useEffect(() => {
    if (activeBook && activeChapter) {
      setVerseBook(activeBook);
      setVerseChapter(activeChapter);
    }
  }, [activeBook, activeChapter]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const notesData = await noteAPI.getAllNotes();
      setNotes(notesData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const tagsData = await noteAPI.getAllTags();
      setTags(tagsData);
    } catch (err) {
      console.error('Failed to load tags:', err);
    }
  };

  const handleCreateNote = async () => {
    if (!noteText.trim()) return;

    try {
      setLoading(true);
      const noteData: CreateNoteRequest = {
        note_text: noteText,
        tag_id: selectedTagId || undefined,
        verses: verseBook && verseChapter && verseNumber ? [{
          book: verseBook,
          chapter: Number(verseChapter),
          verse: Number(verseNumber),
        }] : undefined,
      };

      await noteAPI.createNote(noteData);
      await loadNotes();
      resetForm();
      setCreateModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNote = async () => {
    if (!selectedNote || !noteText.trim()) return;

    try {
      setLoading(true);
      const noteData: UpdateNoteRequest = {
        note_text: noteText,
        tag_id: selectedTagId || undefined,
        verses: verseBook && verseChapter && verseNumber ? [{
          book: verseBook,
          chapter: Number(verseChapter),
          verse: Number(verseNumber),
        }] : undefined,
      };

      await noteAPI.updateNote(selectedNote.id, noteData);
      await loadNotes();
      resetForm();
      setEditModalOpen(false);
      setSelectedNote(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update note');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      setLoading(true);
      await noteAPI.deleteNote(noteId);
      await loadNotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (note: Note) => {
    setSelectedNote(note);
    setNoteText(note.note_text);
    setSelectedTagId(note.tag?.id || null);
    
    if (note.verses.length > 0) {
      const firstVerse = note.verses[0];
      setVerseBook(firstVerse.book);
      setVerseChapter(firstVerse.chapter);
      setVerseNumber(firstVerse.verse);
    }
    
    setEditModalOpen(true);
  };

  const resetForm = () => {
    setNoteText('');
    setSelectedTagId(null);
    setVerseBook(activeBook || '');
    setVerseChapter(activeChapter || '');
    setVerseNumber('');
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.note_text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || note.tag?.id === selectedTag;
    return matchesSearch && matchesTag;
  });

  const tagOptions = tags.map(tag => ({
    value: tag.id,
    label: tag.name,
  }));

  return (
    <Box p="md">
      <LoadingOverlay visible={loading} /> 
      {error && (
        <Alert color="red" mb="md" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Group justify="space-between" mb="md">
        <Text size="xl" fw={700}>Notes</Text>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setCreateModalOpen(true)}
        >
          Create Note
        </Button>
      </Group>

      <Group mb="md">
        <TextInput
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.currentTarget.value)}
          leftSection={<IconSearch size={16} />}
          style={{ flex: 1 }}
        />
        <Select
          placeholder="Filter by tag"
          value={selectedTag}
          onChange={setSelectedTag}
          data={[
            { value: '', label: 'All tags' },
            ...tagOptions,
          ]}
          clearable
          style={{ minWidth: 200 }}
        />
      </Group>

      <ScrollArea h={400}>
        <Stack>
          {filteredNotes.map((note) => (
            <Card key={note.id} shadow="sm" padding="md" withBorder>
              <Group justify="space-between" align="flex-start">
                <Box style={{ flex: 1 }}>
                  <Text size="sm" mb="xs">
                    {note.note_text}
                  </Text>
                  
                  {note.tag && (
                    <Badge variant="light" size="sm" mb="xs">
                      {note.tag.name}
                    </Badge>
                  )}
                  
                  {note.verses.length > 0 && (
                    <Group gap="xs" mb="xs">
                      {note.verses.map((verse, index) => (
                        <Badge key={index} variant="outline" size="sm">
                          {verse.book} {verse.chapter}:{verse.verse}
                        </Badge>
                      ))}
                    </Group>
                  )}
                  
                  <Text size="xs" c="dimmed">
                    Created: {new Date(note.created_at).toLocaleDateString()}
                  </Text>
                </Box>
                
                <Group>
                  <ActionIcon
                    variant="subtle"
                    onClick={() => openEditModal(note)}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Group>
            </Card>
          ))}
        </Stack>
      </ScrollArea>

      <Modal
        opened={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          resetForm();
        }}
        title="Create New Note"
        size="lg"
      >
        <Stack>
          <Textarea
            label="Note Text"
            placeholder="Enter your note..."
            value={noteText}
            onChange={(event) => setNoteText(event.currentTarget.value)}
            minRows={3}
            required
          />
          
          <Select
            label="Tag"
            placeholder="Select a tag (optional)"
            value={selectedTagId}
            onChange={setSelectedTagId}
            data={tagOptions}
            clearable
          />
          
          <Divider label="Verse Reference (optional)" />
          
          <Group grow>
            <TextInput
              label="Book"
              placeholder="e.g., John"
              value={verseBook}
              onChange={(event) => setVerseBook(event.currentTarget.value)}
            />
            <TextInput
              label="Chapter"
              placeholder="e.g., 3"
              value={verseChapter}
              onChange={(event) => setVerseChapter(Number(event.currentTarget.value) || '')}
              type="number"
            />
            <TextInput
              label="Verse"
              placeholder="e.g., 16"
              value={verseNumber}
              onChange={(event) => setVerseNumber(Number(event.currentTarget.value) || '')}
              type="number"
            />
          </Group>
          
          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={() => {
                setCreateModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateNote} disabled={!noteText.trim()}>
              Create Note
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedNote(null);
          resetForm();
        }}
        title="Edit Note"
        size="lg"
      >
        <Stack>
          <Textarea
            label="Note Text"
            placeholder="Enter your note..."
            value={noteText}
            onChange={(event) => setNoteText(event.currentTarget.value)}
            minRows={3}
            required
          />
          
          <Select
            label="Tag"
            placeholder="Select a tag (optional)"
            value={selectedTagId}
            onChange={setSelectedTagId}
            data={tagOptions}
            clearable
          />
          
          <Divider label="Verse Reference (optional)" />
          
          <Group grow>
            <TextInput
              label="Book"
              placeholder="e.g., John"
              value={verseBook}
              onChange={(event) => setVerseBook(event.currentTarget.value)}
            />
            <TextInput
              label="Chapter"
              placeholder="e.g., 3"
              value={verseChapter}
              onChange={(event) => setVerseChapter(Number(event.currentTarget.value) || '')}
              type="number"
            />
            <TextInput
              label="Verse"
              placeholder="e.g., 16"
              value={verseNumber}
              onChange={(event) => setVerseNumber(Number(event.currentTarget.value) || '')}
              type="number"
            />
          </Group>
          
          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={() => {
                setEditModalOpen(false);
                setSelectedNote(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateNote} disabled={!noteText.trim()}>
              Update Note
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
};

export default NoteManager;