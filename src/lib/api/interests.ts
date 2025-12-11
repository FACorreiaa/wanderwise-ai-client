// Interests queries and mutations - RPC version
import { createQuery, createMutation, useQueryClient } from '@tanstack/solid-query';
import { createClient } from '@connectrpc/connect';
import { create } from '@bufbuild/protobuf';
import { InterestService } from '@buf/loci_loci-proto.bufbuild_es/proto/loci/interest/interest_pb.js';
import {
  GetInterestsRequestSchema,
  CreateInterestRequestSchema,
  UpdateInterestRequestSchema,
} from '@buf/loci_loci-proto.bufbuild_es/proto/loci/interest/interest_pb.js';
import { queryKeys } from './shared';
import { getAuthToken } from '../auth/tokens';
import { transport } from '../connect-transport';
import type { Interest } from './types';

// Create the interest service client
const interestClient = createClient(InterestService, transport);

// ===================
// INTERESTS QUERIES
// ===================

export const useInterests = () => {
  return createQuery(() => ({
    queryKey: queryKeys.interests,
    queryFn: async (): Promise<Interest[]> => {
      const request = create(GetInterestsRequestSchema, { activeOnly: false });
      const response = await interestClient.getInterests(request);

      return response.interests.map((interest): Interest => ({
        id: interest.id,
        name: interest.name,
        description: interest.description ?? null,
        active: interest.active ?? true,
        source: (interest.source === 'global' ? 'global' : 'custom') as 'global' | 'custom',
        created_at: interest.createdAt ? new Date(Number(interest.createdAt.seconds) * 1000).toISOString() : '',
        updated_at: interest.updatedAt ? new Date(Number(interest.updatedAt.seconds) * 1000).toISOString() : null,
      }));
    },
    staleTime: 15 * 60 * 1000, // 15 minutes - interests don't change often
  }));
};

export const useCreateInterestMutation = () => {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: async ({ name, description, active = true }: { name: string; description: string; active?: boolean }) => {
      const request = create(CreateInterestRequestSchema, {
        name,
        description,
        active,
      });

      const response = await interestClient.createInterest(request);
      return { success: response.success, message: response.message };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.interests });
    },
  }));
};

export const useUpdateInterestMutation = () => {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: async ({ id, name, description, active }: {
      id: string;
      name?: string;
      description?: string;
      active?: boolean
    }) => {
      const request = create(UpdateInterestRequestSchema, {
        interestId: id,
        name: name ?? '',
        description,
        active: active ?? true,
      });

      const response = await interestClient.updateInterest(request);
      return { success: response.success, message: response.message };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.interests });
    },
  }));
};

export const useToggleInterestActiveMutation = () => {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const request = create(UpdateInterestRequestSchema, {
        interestId: id,
        name: '', // Required by proto but not changing
        active,
      });

      const response = await interestClient.updateInterest(request);
      return { success: response.success, message: response.message };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.interests });
    },
  }));
};

export const useDeleteInterestMutation = () => {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    // Note: Delete might not be in the proto - using a placeholder that toggles inactive
    mutationFn: async (interestId: string) => {
      // For now, toggle to inactive since proto doesn't have delete
      const request = create(UpdateInterestRequestSchema, {
        interestId,
        name: '',
        active: false,
      });

      const response = await interestClient.updateInterest(request);
      return { success: response.success, message: response.message };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.interests });
    },
  }));
};