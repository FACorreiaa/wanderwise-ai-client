// User profile queries and mutations
import { useQuery, useMutation, useQueryClient } from "@tanstack/solid-query";
import { createClient } from "@connectrpc/connect";
import { create } from "@bufbuild/protobuf";
import { UserService } from "@buf/loci_loci-proto.bufbuild_es/loci/user/user_pb.js";
import {
  GetUserProfileRequestSchema,
  UpdateUserProfileRequestSchema,
  UpdateProfileParamsSchema,
} from "@buf/loci_loci-proto.bufbuild_es/loci/user/user_pb.js";
import { queryKeys } from "./shared";
import {
  fetchPreferenceProfilesRPC,
  useCreateSearchProfileMutation,
  useDeleteSearchProfileMutation,
} from "./profiles";
import { getAuthToken } from "../auth/tokens";
import { transport } from "../connect-transport";
import type { UserProfile, UserProfileResponse } from "./types";

// Create the user service client
const userClient = createClient(UserService, transport);

// Helper type for RPC profile updates
export interface UpdateUserProfileParams {
  username?: string;
  email?: string;
  displayName?: string;
  profileImageUrl?: string;
  firstname?: string;
  lastname?: string;
  phoneNumber?: string;
  age?: number;
  city?: string;
  country?: string;
  aboutYou?: string;
  location?: string;
  interests?: string[];
  badges?: string[];
}

// ===================
// PROFILE QUERIES
// ===================

export const useProfiles = () => {
  return useQuery(() => ({
    queryKey: queryKeys.profiles,
    queryFn: () => fetchPreferenceProfilesRPC() as unknown as Promise<UserProfile[]>,
    staleTime: 10 * 60 * 1000, // 10 minutes
  }));
};

export const useProfile = (profileId: string) => {
  return useQuery(() => ({
    queryKey: queryKeys.profile(profileId),
    queryFn: async (): Promise<UserProfile | null> => {
      // Get profile from RPC via profiles.ts
      const profiles = await fetchPreferenceProfilesRPC();
      return (profiles.find((p: any) => p.id === profileId) as unknown as UserProfile) || null;
    },
    enabled: !!profileId,
  }));
};

export const useDefaultProfile = () => {
  return useQuery(() => ({
    queryKey: queryKeys.defaultProfile,
    queryFn: async () => {
      const profiles = await fetchPreferenceProfilesRPC();
      return (profiles.find((p) => (p as any).is_default) || profiles[0]) as unknown as UserProfile;
    },
  }));
};

export const useCreateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: async (profileData: Partial<UserProfile>) => {
      // Map budget_level from string (if any) to number for the search profile mutation
      const mappedData: any = { ...profileData };
      if (typeof profileData.budget_level === "string") {
        mappedData.budget_level = parseInt(profileData.budget_level, 10) || 0;
      }

      await useCreateSearchProfileMutation().mutateAsync(mappedData);
      return profileData as UserProfile;
    },
    onSuccess: (newProfile) => {
      queryClient.setQueryData(queryKeys.profiles, (old: UserProfile[] = []) => [
        ...old,
        newProfile,
      ]);
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles });
    },
  }));
};

/**
 * Fetch the authenticated user's profile via RPC
 */
export const useUserProfileQuery = () => {
  return useQuery(() => ({
    queryKey: ["userProfile", "rpc"],
    queryFn: async (): Promise<UserProfileResponse> => {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      const request = create(GetUserProfileRequestSchema, {});
      const response = await userClient.getUserProfile(request);

      if (!response.profile) {
        throw new Error("No profile returned");
      }

      const profile = response.profile;

      return {
        id: profile.id,
        email: profile.email,
        username: profile.username ?? undefined,
        first_name: profile.firstname ?? undefined,
        last_name: profile.lastname ?? undefined,
        phone: profile.phoneNumber ?? undefined,
        age: profile.age ? Number(profile.age) : undefined,
        city: profile.city ?? undefined,
        country: profile.country ?? undefined,
        about_you: profile.aboutYou ?? undefined,
        bio: profile.bio ?? undefined,
        location: profile.location ?? undefined,
        display_name: profile.displayName ?? undefined,
        profile_image_url: profile.profileImageUrl ?? undefined,
        is_active: profile.isActive,
        theme: profile.theme ?? undefined,
        language: profile.language ?? undefined,
        interests: profile.interests.length > 0 ? [...profile.interests] : [],
        badges: profile.badges.length > 0 ? [...profile.badges] : [],
        created_at: profile.createdAt
          ? new Date(Number(profile.createdAt.seconds) * 1000).toISOString()
          : "",
        updated_at: profile.updatedAt
          ? new Date(Number(profile.updatedAt.seconds) * 1000).toISOString()
          : "",
      } as unknown as UserProfileResponse;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled: !!getAuthToken(),
  }));
};

/**
 * Update the authenticated user's profile via RPC
 */
export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: async (
      params: UpdateUserProfileParams,
    ): Promise<{ success: boolean; message?: string }> => {
      // Only include fields that have non-empty values to avoid validation errors
      const updateParamsData: Record<string, unknown> = {};

      if (params.username !== undefined && params.username !== "") {
        updateParamsData.username = params.username;
      }
      if (params.email !== undefined && params.email !== "") {
        updateParamsData.email = params.email;
      }
      if (params.displayName !== undefined && params.displayName !== "") {
        updateParamsData.displayName = params.displayName;
      }
      if (params.profileImageUrl !== undefined && params.profileImageUrl !== "") {
        updateParamsData.profileImageUrl = params.profileImageUrl;
      }
      if (params.firstname !== undefined && params.firstname !== "") {
        updateParamsData.firstname = params.firstname;
      }
      if (params.lastname !== undefined && params.lastname !== "") {
        updateParamsData.lastname = params.lastname;
      }
      if (params.phoneNumber !== undefined && params.phoneNumber !== "") {
        updateParamsData.phoneNumber = params.phoneNumber;
      }
      if (params.age !== undefined) {
        updateParamsData.age = params.age;
      }
      if (params.city !== undefined && params.city !== "") {
        updateParamsData.city = params.city;
      }
      if (params.country !== undefined && params.country !== "") {
        updateParamsData.country = params.country;
      }
      if (params.aboutYou !== undefined && params.aboutYou !== "") {
        updateParamsData.aboutYou = params.aboutYou;
      }
      if (params.location !== undefined && params.location !== "") {
        updateParamsData.location = params.location;
      }
      if (params.interests !== undefined && params.interests.length > 0) {
        updateParamsData.interests = params.interests;
      }
      if (params.badges !== undefined && params.badges.length > 0) {
        updateParamsData.badges = params.badges;
      }

      const updateParams = create(UpdateProfileParamsSchema, updateParamsData);

      const request = create(UpdateUserProfileRequestSchema, {
        params: updateParams,
      });

      const response = await userClient.updateUserProfile(request);

      return {
        success: response.success,
        message: response.message ?? undefined,
      };
    },
    onSuccess: () => {
      // Invalidate both profile queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.defaultProfile });
    },
  }));
};

export const useDeleteProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: async (profileId: string) => {
      await useDeleteSearchProfileMutation().mutateAsync(profileId);
      return { message: "Profile deleted" };
    },
    onSuccess: (_, profileId) => {
      queryClient.setQueryData(queryKeys.profiles, (old: UserProfile[] = []) =>
        old.filter((profile) => profile.id !== profileId),
      );
      queryClient.removeQueries({ queryKey: queryKeys.profile(profileId) });
    },
  }));
};

// useSetDefaultProfileMutation is exported from profiles.ts

export const useUploadAvatarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: async (file: File) => {
      const { uploadFile } = await import("~/lib/api");
      // Assuming the backend endpoint is /user/avatar based on previous code,
      // but uploadFile appends it to API_BASE_URL.
      // If previous code was /api/user/avatar and no proxy, it was likely wrong.
      // Let's assume the backend endpoint is /user/avatar.
      const response = await uploadFile(file, "/user/avatar");
      return { avatar_url: response };
    },
    onSuccess: (result) => {
      // Update the default profile with new avatar
      queryClient.setQueryData(queryKeys.defaultProfile, (old: UserProfile) =>
        old ? { ...old, avatar: result.avatar_url } : old,
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.defaultProfile });
    },
  }));
};
