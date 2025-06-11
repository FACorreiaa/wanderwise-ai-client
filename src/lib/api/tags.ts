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
    queryFn: () => apiRequest<PersonalTag[]>('/user/tags/'),
    staleTime: 15 * 60 * 1000,
  }));
};

export const useCreateTagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: ({ name, description, tagType = 'preference' }: {
      name: string;
      description: string;
      tagType?: string;
    }) =>
      apiRequest<PersonalTag>('/user/tags/', {
        method: 'POST',
        body: JSON.stringify({ name, description, tag_type: tagType }),
      }),
    onSuccess: (newTag) => {
      queryClient.setQueryData(queryKeys.tags, (old: PersonalTag[] = []) => [...old, newTag]);
    },
  }));
};