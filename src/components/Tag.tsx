import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextInput,
  Select,
  Modal,
  Group,
  Stack,
  Text,
  Card,
  ActionIcon,
  LoadingOverlay,
  Alert,
  ScrollArea,
  Badge,
} from '@mantine/core';
import { IconPlus, IconEdit, IconTrash, IconSearch, IconTag } from '@tabler/icons-react';

interface Tag {
  id: string;
  name: string;
  parent_tag: string | null;
  created_at: string;
  updated_at: string;
}

interface CreateTagRequest {
  name: string;
  parent_tag?: string;
}

interface UpdateTagRequest {
  name?: string;
  parent_tag?: string;
}

const API_BASE_URL = 'https://bible-research.vercel.app/api/v1';

const tagAPI = {
  getAllTags: async (): Promise<Tag[]> => {
    const response = await fetch(`${API_BASE_URL}/tags/`);
    if (!response.ok) throw new Error('Failed to fetch tags');
    return response.json();
  },

  getTag: async (id: string): Promise<Tag> => {
    const response = await fetch(`${API_BASE_URL}/tags/${id}/`);
    if (!response.ok) throw new Error('Failed to fetch tag');
    return response.json();
  },

  createTag: async (tagData: CreateTagRequest): Promise<Tag> => {
    const response = await fetch(`${API_BASE_URL}/tags/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tagData),
    });
    if (!response.ok) throw new Error('Failed to create tag');
    return response.json();
  },

  updateTag: async (id: string, tagData: UpdateTagRequest): Promise<Tag> => {
    const response = await fetch(`${API_BASE_URL}/tags/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tagData),
    });
    if (!response.ok) throw new Error('Failed to update tag');
    return response.json();
  },

  deleteTag: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/tags/${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete tag');
  },
};

const TagManager: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  
  const [tagName, setTagName] = useState('');
  const [parentTagId, setParentTagId] = useState<string | null>(null);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const tagsData = await tagAPI.getAllTags();
      setTags(tagsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async () => {
    if (!tagName.trim()) return;

    try {
      setLoading(true);
      const tagData: CreateTagRequest = {
        name: tagName,
        parent_tag: parentTagId || undefined,
      };

      await tagAPI.createTag(tagData);
      await loadTags();
      resetForm();
      setCreateModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tag');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTag = async () => {
    if (!selectedTag || !tagName.trim()) return;

    try {
      setLoading(true);
      const tagData: UpdateTagRequest = {
        name: tagName,
        parent_tag: parentTagId || undefined,
      };

      await tagAPI.updateTag(selectedTag.id, tagData);
      await loadTags();
      resetForm();
      setEditModalOpen(false);
      setSelectedTag(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update tag');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (!confirm('Are you sure you want to delete this tag? This action cannot be undone.')) return;

    try {
      setLoading(true);
      await tagAPI.deleteTag(tagId);
      await loadTags();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete tag');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (tag: Tag) => {
    setSelectedTag(tag);
    setTagName(tag.name);
    setParentTagId(tag.parent_tag);
    setEditModalOpen(true);
  };

  const resetForm = () => {
    setTagName('');
    setParentTagId(null);
  };

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTagHierarchy = (tag: Tag): string => {
    if (!tag.parent_tag) return tag.name;
    
    const parentTag = tags.find(t => t.id === tag.parent_tag);
    if (parentTag) {
      return `${getTagHierarchy(parentTag)} > ${tag.name}`;
    }
    return tag.name;
  };

  const getChildTags = (parentId: string): Tag[] => {
    return tags.filter(tag => tag.parent_tag === parentId);
  };

  const parentTagOptions = tags
    .filter(tag => tag.parent_tag === null) 
    .map(tag => ({
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

      <Group position="apart" mb="md">
        <Text size="xl" weight={700}>Tag Management</Text>
        <Button
          leftIcon={<IconPlus size={16} />}
          onClick={() => setCreateModalOpen(true)}
        >
          Create Tag
        </Button>
      </Group>

      <TextInput
        placeholder="Search tags..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.currentTarget.value)}
        icon={<IconSearch size={16} />}
        mb="md"
      />

      <ScrollArea style={{ height: 400 }}>
        <Stack>
          {filteredTags.map((tag) => (
            <Card key={tag.id} shadow="sm" padding="md" withBorder>
              <Group position="apart" align="flex-start">
                <Box style={{ flex: 1 }}>
                  <Group mb="xs">
                    <IconTag size={16} />
                    <Text weight={500}>{getTagHierarchy(tag)}</Text>
                  </Group>
                  
                  {tag.parent_tag && (
                    <Badge variant="light" size="sm" mb="xs">
                      Child Tag
                    </Badge>
                  )}
                  
                  {getChildTags(tag.id).length > 0 && (
                    <Group spacing="xs" mb="xs">
                      <Text size="sm" color="dimmed">Children:</Text>
                      {getChildTags(tag.id).map((childTag) => (
                        <Badge key={childTag.id} variant="outline" size="sm">
                          {childTag.name}
                        </Badge>
                      ))}
                    </Group>
                  )}
                  
                  <Text size="xs" color="dimmed">
                    Created: {new Date(tag.created_at).toLocaleDateString()}
                  </Text>
                </Box>
                
                <Group>
                  <ActionIcon
                    variant="subtle"
                    onClick={() => openEditModal(tag)}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => handleDeleteTag(tag.id)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Group>
            </Card>
          ))}
          
          {filteredTags.length === 0 && (
            <Text color="dimmed" align="center" py="xl">
              No tags found
            </Text>
          )}
        </Stack>
      </ScrollArea>

      {/* Create Tag Modal */}
      <Modal
        opened={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          resetForm();
        }}
        title="Create New Tag"
        size="md"
      >
        <Stack>
          <TextInput
            label="Tag Name"
            placeholder="Enter tag name..."
            value={tagName}
            onChange={(event) => setTagName(event.currentTarget.value)}
            required
          />
          
          <Select
            label="Parent Tag"
            placeholder="Select parent tag (optional)"
            value={parentTagId}
            onChange={setParentTagId}
            data={parentTagOptions}
            clearable
          />
          
          <Group position="right">
            <Button
              variant="default"
              onClick={() => {
                setCreateModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateTag} disabled={!tagName.trim()}>
              Create Tag
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit Tag Modal */}
      <Modal
        opened={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedTag(null);
          resetForm();
        }}
        title="Edit Tag"
        size="md"
      >
        <Stack>
          <TextInput
            label="Tag Name"
            placeholder="Enter tag name..."
            value={tagName}
            onChange={(event) => setTagName(event.currentTarget.value)}
            required
          />
          
          <Select
            label="Parent Tag"
            placeholder="Select parent tag (optional)"
            value={parentTagId}
            onChange={setParentTagId}
            data={parentTagOptions.filter(option => option.value !== selectedTag?.id)} // Prevent self-parent
            clearable
          />
          
          <Group position="right">
            <Button
              variant="default"
              onClick={() => {
                setEditModalOpen(false);
                setSelectedTag(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateTag} disabled={!tagName.trim()}>
              Update Tag
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
};

export default TagManager;