// API barrel exports - centralized access to all API queries and mutations

// Export shared utilities and types
export * from './shared';
export * from './types';

// =======================
// SOLIDSTART ENHANCED APIS
// =======================

// Export SolidStart utilities
export * from './solidstart';

// Export SolidStart migration utilities
export * from './migration';

// Export SolidStart route configurations
export * from './routes-solidstart';

// Export enhanced authentication API
export * from './auth-solidstart';

// Export enhanced POI and favorites API
export * from './pois-solidstart';

// Export enhanced chat and LLM API
export * from './llm-solidstart';

// Export enhanced content API (hotels, restaurants)
export * from './content-solidstart';

// =======================
// LEGACY APIS (for backwards compatibility)
// =======================

// Export legacy authentication queries
export * from './auth';

// Export user profile queries
export * from './user';

// Export interests and tags queries
export * from './interests';
export * from './tags';

// Export legacy POI and favorites queries
export * from './pois';

// Export itinerary and list queries
export * from './itineraries';
export * from './lists';

// Export legacy LLM and chat queries
export * from './llm';

// Export legacy hotel and restaurant queries
export * from './hotels';
export * from './restaurants';

// Export settings queries
export * from './settings';

// Export search profile queries
export * from './profiles';

// Export city queries
export * from './cities';

// Export statistics queries
export * from './statistics';

// Export recents queries
export * from './recents';

// =======================
// SMART API SELECTION
// =======================

// Re-export the migration utilities for easy access
export { 
  featureFlags, 
  migrationPlan, 
  autoMigrate, 
  compat,
  createMigratedHook,
  migrationStatus
} from './migration';