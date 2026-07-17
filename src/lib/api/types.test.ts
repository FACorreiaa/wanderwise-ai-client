import { describe, it, expect } from "vitest";
import type { DomainType, StreamEventType, POI, ChatMessage, Interest, PersonalTag } from "./types";

// ==================
// Type Guard Functions (for testing type validity)
// ==================

/**
 * Type guard to check if a value is a valid DomainType
 */
const isValidDomainType = (value: unknown): value is DomainType => {
  const validDomains: DomainType[] = [
    "general",
    "itinerary",
    "accommodation",
    "dining",
    "activities",
  ];
  return typeof value === "string" && validDomains.includes(value as DomainType);
};

/**
 * Type guard to check if a value is a valid StreamEventType
 */
const isValidStreamEventType = (value: unknown): value is StreamEventType => {
  const validTypes: StreamEventType[] = [
    "start",
    "chunk",
    "complete",
    "error",
    "city_data",
    "general_pois",
    "itinerary",
    "hotels",
    "restaurants",
    "activities",
    "progress",
  ];
  return typeof value === "string" && validTypes.includes(value as StreamEventType);
};

/**
 * Type guard for POI objects
 */
const isValidPOI = (value: unknown): value is POI => {
  if (!value || typeof value !== "object") return false;
  const poi = value as Record<string, unknown>;
  return (
    typeof poi.id === "string" &&
    typeof poi.name === "string" &&
    typeof poi.category === "string" &&
    typeof poi.latitude === "number" &&
    typeof poi.longitude === "number"
  );
};

/**
 * Type guard for ChatMessage objects
 */
const isValidChatMessage = (value: unknown): value is ChatMessage => {
  if (!value || typeof value !== "object") return false;
  const msg = value as Record<string, unknown>;
  return (
    typeof msg.id === "string" &&
    ["user", "assistant", "system"].includes(msg.type as string) &&
    typeof msg.content === "string" &&
    msg.timestamp instanceof Date
  );
};

/**
 * Type guard for Interest objects
 */
const isValidInterest = (value: unknown): value is Interest => {
  if (!value || typeof value !== "object") return false;
  const interest = value as Record<string, unknown>;
  return (
    typeof interest.id === "string" &&
    typeof interest.name === "string" &&
    typeof interest.created_at === "string" &&
    ["global", "custom"].includes(interest.source as string)
  );
};

/**
 * Type guard for PersonalTag objects
 */
const isValidPersonalTag = (value: unknown): value is PersonalTag => {
  if (!value || typeof value !== "object") return false;
  const tag = value as Record<string, unknown>;
  return (
    typeof tag.id === "string" &&
    typeof tag.name === "string" &&
    typeof tag.tag_type === "string" &&
    typeof tag.created_at === "string"
  );
};

// ==================
// DomainType Tests
// ==================
describe("DomainType", () => {
  it('should accept "general" as valid domain', () => {
    expect(isValidDomainType("general")).toBe(true);
  });

  it('should accept "itinerary" as valid domain', () => {
    expect(isValidDomainType("itinerary")).toBe(true);
  });

  it('should accept "accommodation" as valid domain', () => {
    expect(isValidDomainType("accommodation")).toBe(true);
  });

  it('should accept "dining" as valid domain', () => {
    expect(isValidDomainType("dining")).toBe(true);
  });

  it('should accept "activities" as valid domain', () => {
    expect(isValidDomainType("activities")).toBe(true);
  });

  it("should reject invalid domain types", () => {
    expect(isValidDomainType("invalid")).toBe(false);
    expect(isValidDomainType("")).toBe(false);
    expect(isValidDomainType(null)).toBe(false);
    expect(isValidDomainType(undefined)).toBe(false);
    expect(isValidDomainType(123)).toBe(false);
  });
});

// ==================
// StreamEventType Tests
// ==================
describe("StreamEventType", () => {
  const validTypes = [
    "start",
    "chunk",
    "complete",
    "error",
    "city_data",
    "general_pois",
    "itinerary",
    "hotels",
    "restaurants",
    "activities",
    "progress",
  ];

  validTypes.forEach((type) => {
    it(`should accept "${type}" as valid stream event type`, () => {
      expect(isValidStreamEventType(type)).toBe(true);
    });
  });

  it("should reject invalid stream event types", () => {
    expect(isValidStreamEventType("invalid")).toBe(false);
    expect(isValidStreamEventType("unknown")).toBe(false);
    expect(isValidStreamEventType("")).toBe(false);
    expect(isValidStreamEventType(null)).toBe(false);
  });
});

// ==================
// POI Type Guard Tests
// ==================
describe("POI type guard", () => {
  it("should validate a minimal valid POI", () => {
    const validPoi = {
      id: "poi-123",
      name: "Colosseum",
      category: "Historical Site",
      latitude: 41.8902,
      longitude: 12.4922,
    };
    expect(isValidPOI(validPoi)).toBe(true);
  });

  it("should validate a POI with optional fields", () => {
    const fullPoi = {
      id: "poi-456",
      name: "Trevi Fountain",
      category: "Landmark",
      latitude: 41.9009,
      longitude: 12.4833,
      description: "Famous fountain",
      rating: 4.8,
      tags: ["landmark", "free"],
      address: "Piazza di Trevi",
    };
    expect(isValidPOI(fullPoi)).toBe(true);
  });

  it("should reject POI missing required fields", () => {
    expect(isValidPOI({ id: "test" })).toBe(false);
    expect(isValidPOI({ name: "test", category: "test" })).toBe(false);
    expect(isValidPOI({})).toBe(false);
    expect(isValidPOI(null)).toBe(false);
  });

  it("should reject POI with wrong types", () => {
    expect(
      isValidPOI({
        id: 123, // should be string
        name: "Test",
        category: "Test",
        latitude: 0,
        longitude: 0,
      }),
    ).toBe(false);
  });
});

// ==================
// ChatMessage Type Guard Tests
// ==================
describe("ChatMessage type guard", () => {
  it("should validate a user message", () => {
    const userMessage = {
      id: "msg-1",
      type: "user",
      content: "Hello",
      timestamp: new Date(),
    };
    expect(isValidChatMessage(userMessage)).toBe(true);
  });

  it("should validate an assistant message", () => {
    const assistantMessage = {
      id: "msg-2",
      type: "assistant",
      content: "How can I help?",
      timestamp: new Date(),
    };
    expect(isValidChatMessage(assistantMessage)).toBe(true);
  });

  it("should validate a system message", () => {
    const systemMessage = {
      id: "msg-3",
      type: "system",
      content: "Session started",
      timestamp: new Date(),
    };
    expect(isValidChatMessage(systemMessage)).toBe(true);
  });

  it("should reject message with invalid type", () => {
    expect(
      isValidChatMessage({
        id: "msg-4",
        type: "invalid",
        content: "Test",
        timestamp: new Date(),
      }),
    ).toBe(false);
  });

  it("should reject message missing required fields", () => {
    expect(isValidChatMessage({ id: "test" })).toBe(false);
    expect(isValidChatMessage(null)).toBe(false);
  });
});

// ==================
// Interest Type Guard Tests
// ==================
describe("Interest type guard", () => {
  it("should validate a global interest", () => {
    const interest = {
      id: "int-1",
      name: "History",
      created_at: "2024-01-01T00:00:00Z",
      source: "global",
    };
    expect(isValidInterest(interest)).toBe(true);
  });

  it("should validate a custom interest", () => {
    const interest = {
      id: "int-2",
      name: "Custom Topic",
      created_at: "2024-01-01T00:00:00Z",
      source: "custom",
    };
    expect(isValidInterest(interest)).toBe(true);
  });

  it("should reject interest with invalid source", () => {
    expect(
      isValidInterest({
        id: "int-3",
        name: "Test",
        created_at: "2024-01-01T00:00:00Z",
        source: "invalid",
      }),
    ).toBe(false);
  });
});

// ==================
// PersonalTag Type Guard Tests
// ==================
describe("PersonalTag type guard", () => {
  it("should validate a personal tag", () => {
    const tag = {
      id: "tag-1",
      name: "Budget",
      tag_type: "cost",
      created_at: "2024-01-01T00:00:00Z",
    };
    expect(isValidPersonalTag(tag)).toBe(true);
  });

  it("should validate a tag with optional fields", () => {
    const tag = {
      id: "tag-2",
      name: "Accessible",
      tag_type: "accessibility",
      description: "Wheelchair accessible",
      source: "global",
      created_at: "2024-01-01T00:00:00Z",
    };
    expect(isValidPersonalTag(tag)).toBe(true);
  });

  it("should reject tag missing required fields", () => {
    expect(isValidPersonalTag({ id: "test" })).toBe(false);
    expect(isValidPersonalTag({})).toBe(false);
    expect(isValidPersonalTag(null)).toBe(false);
  });
});

// ==================
// Integration Tests - Type Compatibility
// ==================
describe("Type Integration Tests", () => {
  it("should allow POI arrays to be created", () => {
    const pois: POI[] = [
      { id: "1", name: "Place 1", category: "Cat1", latitude: 0, longitude: 0 },
      { id: "2", name: "Place 2", category: "Cat2", latitude: 1, longitude: 1 },
    ];
    expect(pois.length).toBe(2);
    expect(pois.every((p) => isValidPOI(p))).toBe(true);
  });

  it("should support DomainType in domain arrays", () => {
    const domains: DomainType[] = ["general", "dining", "accommodation"];
    expect(domains.every((d) => isValidDomainType(d))).toBe(true);
  });

  it("should support chat conversation history", () => {
    const history: ChatMessage[] = [
      { id: "1", type: "user", content: "Hello", timestamp: new Date() },
      { id: "2", type: "assistant", content: "Hi!", timestamp: new Date() },
    ];
    expect(history.length).toBe(2);
    expect(history.every((m) => isValidChatMessage(m))).toBe(true);
  });
});
