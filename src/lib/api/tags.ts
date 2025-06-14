// Tags queries and mutations
import { useQuery, useMutation, useQueryClient } from '@tanstack/solid-query';
import { apiRequest, queryKeys } from './shared';
import type { PersonalTag } from './types';

// ===============
// TAGS QUERIES
// ===============

export const useTags = () => {
  return useQuery(() => ({
    queryKey: queryKeys.tags,
    queryFn: () => apiRequest<PersonalTag[]>('/user/tags'),
    staleTime: 15 * 60 * 1000,
  }));
};


export const useCreateTagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: ({ name, description, tag_type, active = true }: {
      name: string;
      description: string;
      tag_type: string;
      active?: boolean;
    }) =>
      apiRequest<PersonalTag>('/user/tags', {
        method: 'POST',
        body: JSON.stringify({ name, description, tag_type, active }),
      }),
    onSuccess: (newTag) => {
      // Add to tags list
      queryClient.setQueryData(queryKeys.tags, (old: PersonalTag[] = []) => [...old, newTag]);
    },
  }));
};

export const useUpdateTagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: ({ id, name, description, tag_type, active }: {
      id: string;
      name?: string;
      description?: string;
      tag_type?: string;
      active?: boolean;
    }) => {
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (tag_type !== undefined) updateData.tag_type = tag_type;
      if (active !== undefined) updateData.active = active;

      return apiRequest<PersonalTag>(`/user/tags/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
    },
    onSuccess: (updatedTag) => {
      // Update in tags list
      queryClient.setQueryData(queryKeys.tags, (old: PersonalTag[] = []) =>
        old.map(tag => tag.id === updatedTag.id ? updatedTag : tag)
      );
    },
  }));
};

export const useToggleTagActiveMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => {
      // Use PUT endpoint to update tag active status
      return apiRequest<PersonalTag>(`/user/tags/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ active }),
      });
    },
    onSuccess: (updatedTag) => {
      // Update the specific tag in the cache
      queryClient.setQueryData(queryKeys.tags, (old: PersonalTag[] = []) =>
        old.map(tag => tag.id === updatedTag.id ? updatedTag : tag)
      );
    },
  }));
};

export const useDeleteTagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: (tagId: string) =>
      apiRequest<{ message: string }>(`/user/tags/${tagId}`, { method: 'DELETE' }),
    onSuccess: (_, tagId) => {
      // Remove from tags list
      queryClient.setQueryData(queryKeys.tags, (old: PersonalTag[] = []) =>
        old.filter(tag => tag.id !== tagId)
      );
    },
  }));
};