// Core SolidStart API utilities and query patterns
import {
  query,
  action,
  revalidate,
  type RouteDefinition,
} from "@solidjs/router";
import { createQuery, createMutation } from "@tanstack/solid-query";
import { apiRequest } from "./shared";
import { queryClient } from "../query-client";

// Enhanced query wrapper that bridges SolidStart and TanStack Query
export function createQueryWithPreload<T, P = void>(
  key: string,
  queryFn: (params?: P) => Promise<T>,
  options?: {
    staleTime?: number;
    cacheTime?: number;
    retry?: boolean | number;
  },
) {
  // SolidStart query for preloading and caching
  const solidStartQuery = query(queryFn, key);

  return {
    // For route-level preloading
    preload: (params?: P) => solidStartQuery(params),

    // For component-level reactivity with TanStack Query
    useQuery: (params?: P) => {
      return createQuery(() => ({
        queryKey: [key, params],
        queryFn: () => queryFn(params),
        staleTime: options?.staleTime ?? 1000 * 60 * 5, // 5 minutes default
        retry: options?.retry ?? 3,
        initialData: () => {
          try {
            // Try to get cached data from SolidStart
            return solidStartQuery(params);
          } catch {
            return undefined;
          }
        },
      }));
    },

    // Direct access to SolidStart query
    query: solidStartQuery,
  };
}

// Enhanced action wrapper for mutations
export function createActionWithMutation<T, P>(
  key: string,
  mutationFn: (params: P) => Promise<T>,
  options?: {
    invalidates?: string[];
    optimisticUpdate?: (oldData: any, params: P) => any;
    onSuccess?: (data: T, params: P) => void;
    onError?: (error: Error, params: P) => void;
  },
) {
  // SolidStart action for server-side handling
  const solidStartAction = action(async (params: P) => {
    const result = await mutationFn(params);

    // Revalidate related queries
    if (options?.invalidates) {
      options.invalidates.forEach((queryKey) => revalidate(queryKey));
    }

    // Call success callback
    if (options?.onSuccess) {
      options.onSuccess(result, params);
    }

    return result;
  }, key);

  return {
    // For component-level mutations with TanStack Query
    useMutation: () => {
      return createMutation(() => ({
        mutationFn,
        onSuccess: (data, params) => {
          // Invalidate TanStack Query cache
          if (options?.invalidates) {
            options.invalidates.forEach((queryKey) => {
              queryClient.invalidateQueries({ queryKey: [queryKey] });
            });
          }

          if (options?.onSuccess) {
            options.onSuccess(data, params);
          }
        },
        onError: options?.onError,
        // Optimistic updates
        onMutate: options?.optimisticUpdate
          ? async (params) => {
              if (options?.invalidates) {
                // Cancel any outgoing refetches
                await Promise.all(
                  options.invalidates.map((queryKey) =>
                    queryClient.cancelQueries({ queryKey: [queryKey] }),
                  ),
                );

                // Snapshot previous values
                const previousData = options.invalidates.reduce(
                  (acc, queryKey) => {
                    acc[queryKey] = queryClient.getQueryData([queryKey]);
                    return acc;
                  },
                  {} as Record<string, any>,
                );

                // Optimistically update
                options.invalidates.forEach((queryKey) => {
                  queryClient.setQueryData([queryKey], (old: any) =>
                    options.optimisticUpdate!(old, params),
                  );
                });

                return { previousData };
              }
            }
          : undefined,
        onError: (err, params, context) => {
          // Rollback on error
          if (context?.previousData && options?.invalidates) {
            options.invalidates.forEach((queryKey) => {
              queryClient.setQueryData(
                [queryKey],
                context.previousData[queryKey],
              );
            });
          }

          if (options?.onError) {
            options.onError(err as Error, params);
          }
        },
      }));
    },

    // Direct access to SolidStart action
    action: solidStartAction,
  };
}

// Utility to create route definitions with preloading
export function createRouteWithPreload<T>(
  path: string,
  preloadFn: () => Promise<T>,
): RouteDefinition {
  return {
    path,
    preload: preloadFn,
  };
}

// Global revalidation utilities
export const revalidation = {
  // Revalidate all user-related data
  revalidateUserData: () => {
    revalidate("user-profile");
    revalidate("user-favorites");
    revalidate("user-lists");
    revalidate("user-settings");
    revalidate("user-interests");
    revalidate("user-tags");
  },

  // Revalidate content data
  revalidateContent: () => {
    revalidate("pois");
    revalidate("hotels");
    revalidate("restaurants");
    revalidate("cities");
  },

  // Revalidate chat data
  revalidateChat: () => {
    revalidate("chat-sessions");
    revalidate("recent-interactions");
  },

  // Revalidate everything
  revalidateAll: () => {
    revalidation.revalidateUserData();
    revalidation.revalidateContent();
    revalidation.revalidateChat();
  },
};

// Error handling for SolidStart queries
export class SolidStartAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any,
  ) {
    super(message);
    this.name = "SolidStartAPIError";
  }
}

// Enhanced API request wrapper for SolidStart
export async function solidStartApiRequest<T>(
  endpoint: string,
  options: RequestInit & {
    params?: Record<string, string | number | boolean>;
    timeout?: number;
  } = {},
): Promise<T> {
  const { params, timeout = 30000, ...fetchOptions } = options;

  // Build URL with params
  let url = endpoint;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value));
      }
    });
    if (searchParams.toString()) {
      url += `?${searchParams.toString()}`;
    }
  }

  // Add timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await apiRequest(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      throw new SolidStartAPIError(
        error.message,
        (error as any).status,
        (error as any).code,
        (error as any).details,
      );
    }

    throw error;
  }
}

// Prefetch utilities for SolidStart
export const prefetch = {
  // Prefetch user data for dashboard
  userDashboard: async () => {
    const promises = await Promise.allSettled([
      // Add your preload functions here when created
    ]);

    return promises;
  },

  // Prefetch location-based data
  locationData: async (lat: number, lng: number) => {
    const promises = await Promise.allSettled([
      // Add location-based preloads here
    ]);

    return promises;
  },
};
