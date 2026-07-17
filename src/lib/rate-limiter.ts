// Client-side rate limiter for LLM endpoints
export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  retryAfterMs?: number;
}

interface RequestRecord {
  timestamp: number;
  count: number;
}

export class ClientRateLimiter {
  private requests = new Map<string, RequestRecord>();
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private readonly retryAfterMs: number;

  constructor(config: RateLimitConfig) {
    this.maxRequests = config.maxRequests;
    this.windowMs = config.windowMs;
    this.retryAfterMs = config.retryAfterMs || 60000; // Default 1 minute retry
  }

  // Check if request should be allowed for a specific endpoint
  public async checkRateLimit(
    endpoint: string,
  ): Promise<{ allowed: boolean; retryAfter?: number }> {
    // Only apply rate limiting to LLM endpoints containing "prompt-response"
    if (!endpoint.includes("prompt-response")) {
      return { allowed: true };
    }

    const now = Date.now();
    const key = this.getEndpointKey(endpoint);
    const record = this.requests.get(key);

    // Clean up old entries first
    this.cleanup();

    if (!record) {
      // First request for this endpoint
      this.requests.set(key, { timestamp: now, count: 1 });
      return { allowed: true };
    }

    // Check if we're still within the rate limit window
    const timeDiff = now - record.timestamp;

    if (timeDiff >= this.windowMs) {
      // Reset the window
      this.requests.set(key, { timestamp: now, count: 1 });
      return { allowed: true };
    }

    // Within the window - check if we've exceeded the limit
    if (record.count >= this.maxRequests) {
      const retryAfter = Math.ceil((this.windowMs - timeDiff) / 1000); // Convert to seconds
      console.warn(`Rate limit exceeded for ${endpoint}. Retry after ${retryAfter} seconds.`);

      return {
        allowed: false,
        retryAfter: retryAfter,
      };
    }

    // Increment the count
    record.count++;
    return { allowed: true };
  }

  // Generate a key for the endpoint (normalize variations)
  private getEndpointKey(endpoint: string): string {
    // Remove query parameters and normalize the endpoint
    const baseEndpoint = endpoint.split("?")[0];

    // Replace dynamic segments with placeholders for consistent rate limiting
    return baseEndpoint
      .replace(/\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/g, "/{id}") // UUID patterns
      .replace(/\/\d+/g, "/{id}") // Numeric IDs
      .toLowerCase();
  }

  // Clean up old entries to prevent memory leaks
  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, record] of this.requests.entries()) {
      if (now - record.timestamp >= this.windowMs * 2) {
        // Keep for 2x the window
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach((key) => this.requests.delete(key));
  }

  // Get current usage stats for debugging
  public getUsageStats(): Record<string, { count: number; windowExpiry: string }> {
    const now = Date.now();
    const stats: Record<string, { count: number; windowExpiry: string }> = {};

    for (const [key, record] of this.requests.entries()) {
      const timeLeft = Math.max(0, this.windowMs - (now - record.timestamp));
      stats[key] = {
        count: record.count,
        windowExpiry: new Date(now + timeLeft).toISOString(),
      };
    }

    return stats;
  }

  // Reset rate limits for testing purposes
  public reset(): void {
    this.requests.clear();
  }
}

// Default rate limiter instance for LLM endpoints
// 20 requests per minute with 3-second retry delay
export const defaultLLMRateLimiter = new ClientRateLimiter({
  maxRequests: 20,
  windowMs: 60 * 1000, // 1 minute
  retryAfterMs: 3000, // 3 seconds
});

// Rate limit error class
export class RateLimitError extends Error {
  constructor(
    message: string,
    public retryAfter: number,
    public endpoint: string,
  ) {
    super(message);
    this.name = "RateLimitError";
  }
}

// Utility function to wait for retry
export const waitForRetry = (seconds: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

// Show rate limit notification to user
export const showRateLimitNotification = (retryAfter: number, endpoint: string): void => {
  // This could be integrated with your notification system
  console.warn(
    `Rate limit exceeded for ${endpoint}. Please wait ${retryAfter} seconds before trying again.`,
  );

  // You could dispatch a custom event or call a notification service here
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("rate-limit-exceeded", {
        detail: { retryAfter, endpoint },
      }),
    );
  }
};
