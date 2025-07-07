// Migration utilities for transitioning from TanStack Query to SolidStart patterns
import { createSignal } from 'solid-js';
import { queryClient } from '../query-client';

// =======================
// MIGRATION STATUS TRACKING
// =======================

export const [migrationStatus, setMigrationStatus] = createSignal<{
  auth: boolean;
  pois: boolean;
  chat: boolean;
  content: boolean;
  routes: boolean;
}>({
  auth: false,
  pois: false,
  chat: false,
  content: false,
  routes: false,
});

// =======================
// LEGACY HOOK WRAPPERS
// =======================

// Wrapper that checks if new SolidStart API is available, falls back to legacy
export function createMigratedHook<T, P>(
  solidStartHook: (params: P) => T,
  legacyHook: (params: P) => T,
  featureFlag: keyof typeof migrationStatus
) {
  return (params: P): T => {
    const status = migrationStatus();
    
    if (status[featureFlag]) {
      console.log(`✅ Using SolidStart API for ${featureFlag}`);
      return solidStartHook(params);
    } else {
      console.log(`⚠️ Using legacy API for ${featureFlag} - consider migrating`);
      return legacyHook(params);
    }
  };
}

// =======================
// FEATURE FLAGS
// =======================

export const featureFlags = {
  // Enable SolidStart authentication
  enableSolidStartAuth: () => {
    setMigrationStatus(prev => ({ ...prev, auth: true }));
    console.log("🔄 Enabled SolidStart authentication API");
  },
  
  // Enable SolidStart POI API
  enableSolidStartPOIs: () => {
    setMigrationStatus(prev => ({ ...prev, pois: true }));
    console.log("🔄 Enabled SolidStart POI API");
  },
  
  // Enable SolidStart chat API
  enableSolidStartChat: () => {
    setMigrationStatus(prev => ({ ...prev, chat: true }));
    console.log("🔄 Enabled SolidStart chat API");
  },
  
  // Enable SolidStart content API (hotels, restaurants)
  enableSolidStartContent: () => {
    setMigrationStatus(prev => ({ ...prev, content: true }));
    console.log("🔄 Enabled SolidStart content API");
  },
  
  // Enable SolidStart route preloading
  enableSolidStartRoutes: () => {
    setMigrationStatus(prev => ({ ...prev, routes: true }));
    console.log("🔄 Enabled SolidStart route preloading");
  },
  
  // Enable all SolidStart features
  enableAll: () => {
    setMigrationStatus({
      auth: true,
      pois: true,
      chat: true,
      content: true,
      routes: true,
    });
    console.log("🚀 Enabled all SolidStart features");
  },
  
  // Disable SolidStart features (rollback)
  disableAll: () => {
    setMigrationStatus({
      auth: false,
      pois: false,
      chat: false,
      content: false,
      routes: false,
    });
    console.log("🔄 Disabled all SolidStart features - using legacy APIs");
  },
};

// =======================
// COMPATIBILITY LAYER
// =======================

// Compatibility layer for API migration
export const compat = {
  // Check if a feature is migrated
  isMigrated: (feature: keyof typeof migrationStatus) => {
    return migrationStatus()[feature];
  },
  
  // Get the appropriate API based on migration status
  getAPI: <T>(solidStartAPI: T, legacyAPI: T, feature: keyof typeof migrationStatus): T => {
    return migrationStatus()[feature] ? solidStartAPI : legacyAPI;
  },
  
  // Migrate specific components gradually
  migrateComponent: (componentName: string, features: (keyof typeof migrationStatus)[]) => {
    console.log(`🔄 Migrating component ${componentName} to use:`, features);
    
    const updates = features.reduce((acc, feature) => {
      acc[feature] = true;
      return acc;
    }, {} as Partial<typeof migrationStatus>);
    
    setMigrationStatus(prev => ({ ...prev, ...updates }));
  },
};

// =======================
// MIGRATION HELPERS
// =======================

// Clear TanStack Query cache when migrating to prevent stale data
export const clearLegacyCache = (queryKeys: string[]) => {
  queryKeys.forEach(key => {
    queryClient.invalidateQueries({ queryKey: [key] });
    queryClient.removeQueries({ queryKey: [key] });
  });
  console.log("🧹 Cleared legacy cache for:", queryKeys);
};

// Validate migration by checking both APIs return similar data
export const validateMigration = async <T>(
  solidStartFn: () => Promise<T>,
  legacyFn: () => Promise<T>,
  compareFn?: (a: T, b: T) => boolean
) => {
  try {
    const [solidStartResult, legacyResult] = await Promise.allSettled([
      solidStartFn(),
      legacyFn(),
    ]);
    
    if (solidStartResult.status === 'fulfilled' && legacyResult.status === 'fulfilled') {
      const isValid = compareFn 
        ? compareFn(solidStartResult.value, legacyResult.value)
        : JSON.stringify(solidStartResult.value) === JSON.stringify(legacyResult.value);
      
      if (isValid) {
        console.log("✅ Migration validation passed - data matches");
      } else {
        console.warn("⚠️ Migration validation failed - data mismatch");
        console.log("SolidStart result:", solidStartResult.value);
        console.log("Legacy result:", legacyResult.value);
      }
      
      return isValid;
    } else {
      console.error("❌ Migration validation failed - API calls failed");
      return false;
    }
  } catch (error) {
    console.error("❌ Migration validation error:", error);
    return false;
  }
};

// =======================
// MIGRATION PLAN
// =======================

// Step-by-step migration plan
export const migrationPlan = {
  // Phase 1: Core infrastructure and authentication
  phase1: async () => {
    console.log("🚀 Starting Migration Phase 1: Core Infrastructure");
    
    featureFlags.enableSolidStartAuth();
    
    // Clear related legacy cache
    clearLegacyCache(['session', 'user-profile']);
    
    console.log("✅ Phase 1 complete");
  },
  
  // Phase 2: Content APIs (POIs, hotels, restaurants)
  phase2: async () => {
    console.log("🚀 Starting Migration Phase 2: Content APIs");
    
    featureFlags.enableSolidStartPOIs();
    featureFlags.enableSolidStartContent();
    
    // Clear related legacy cache
    clearLegacyCache(['favorites', 'pois', 'hotels', 'restaurants', 'nearby-pois']);
    
    console.log("✅ Phase 2 complete");
  },
  
  // Phase 3: Chat and LLM APIs
  phase3: async () => {
    console.log("🚀 Starting Migration Phase 3: Chat APIs");
    
    featureFlags.enableSolidStartChat();
    
    // Clear related legacy cache
    clearLegacyCache(['chat-sessions', 'chat-messages']);
    
    console.log("✅ Phase 3 complete");
  },
  
  // Phase 4: Route-level preloading
  phase4: async () => {
    console.log("🚀 Starting Migration Phase 4: Route Preloading");
    
    featureFlags.enableSolidStartRoutes();
    
    console.log("✅ Phase 4 complete");
  },
  
  // Complete migration
  complete: async () => {
    console.log("🚀 Starting Complete Migration");
    
    await migrationPlan.phase1();
    await migrationPlan.phase2();
    await migrationPlan.phase3();
    await migrationPlan.phase4();
    
    console.log("🎉 Migration completed successfully!");
  },
  
  // Rollback migration
  rollback: async () => {
    console.log("🔄 Rolling back migration to legacy APIs");
    
    featureFlags.disableAll();
    
    // Force refresh all data
    queryClient.invalidateQueries();
    
    console.log("✅ Rollback complete");
  },
};

// =======================
// ENVIRONMENT-BASED AUTO-MIGRATION
// =======================

// Auto-enable features based on environment
export const autoMigrate = () => {
  const isDev = import.meta.env.DEV;
  const isStaging = import.meta.env.VITE_APP_ENV === 'staging';
  const isProd = import.meta.env.PROD;
  
  if (isDev) {
    // In development, enable all features for testing
    console.log("🔧 Development mode: enabling all SolidStart features");
    featureFlags.enableAll();
  } else if (isStaging) {
    // In staging, enable stable features
    console.log("🔧 Staging mode: enabling stable SolidStart features");
    migrationPlan.phase1();
    migrationPlan.phase2();
  } else if (isProd) {
    // In production, be conservative
    console.log("🔧 Production mode: using legacy APIs by default");
    featureFlags.disableAll();
  }
};

// =======================
// MONITORING AND ANALYTICS
// =======================

// Track migration adoption
export const trackMigration = (feature: keyof typeof migrationStatus, action: 'enable' | 'disable') => {
  // This would integrate with your analytics service
  console.log(`📊 Migration tracking: ${action} ${feature}`);
  
  // Example: Send to analytics
  // analytics.track('solidstart_migration', {
  //   feature,
  //   action,
  //   timestamp: new Date().toISOString(),
  // });
};

// Performance comparison
export const comparePer ­fo­rmance = async <T>(
  name: string,
  solidStartFn: () => Promise<T>,
  legacyFn: () => Promise<T>
) => {
  const solidStartStart = performance.now();
  const solidStartResult = await solidStartFn();
  const solidStartDuration = performance.now() - solidStartStart;
  
  const legacyStart = performance.now();
  const legacyResult = await legacyFn();
  const legacyDuration = performance.now() - legacyStart;
  
  console.log(`⚡ Performance comparison for ${name}:`);
  console.log(`  SolidStart: ${solidStartDuration.toFixed(2)}ms`);
  console.log(`  Legacy: ${legacyDuration.toFixed(2)}ms`);
  console.log(`  Improvement: ${(((legacyDuration - solidStartDuration) / legacyDuration) * 100).toFixed(1)}%`);
  
  return {
    solidStartDuration,
    legacyDuration,
    improvement: (legacyDuration - solidStartDuration) / legacyDuration,
    solidStartResult,
    legacyResult,
  };
};