/**
 * Haptic Feedback Utility
 *
 * Provides haptic/vibration feedback on mobile devices when supported.
 * Falls back gracefully on desktop or unsupported devices.
 */

export type HapticPattern = "light" | "medium" | "heavy" | "success" | "warning" | "error";

/**
 * Check if haptic feedback is supported
 */
export function isHapticSupported(): boolean {
  return "vibrate" in navigator;
}

/**
 * Trigger haptic feedback with a specific pattern
 */
export function triggerHaptic(pattern: HapticPattern = "light"): void {
  if (!isHapticSupported()) {
    return;
  }

  // Vibration patterns in milliseconds [vibrate, pause, vibrate, ...]
  const patterns: Record<HapticPattern, number | number[]> = {
    light: 10, // Single short vibration
    medium: 20, // Single medium vibration
    heavy: 30, // Single strong vibration
    success: [10, 50, 10], // Double tap pattern
    warning: [20, 100, 20, 100, 20], // Triple tap pattern
    error: [30, 50, 30], // Strong double tap
  };

  const vibrationPattern = patterns[pattern];

  try {
    if (typeof vibrationPattern === "number") {
      navigator.vibrate(vibrationPattern);
    } else {
      navigator.vibrate(vibrationPattern);
    }
  } catch (error) {
    console.warn("Haptic feedback failed:", error);
  }
}

/**
 * Haptic feedback for specific UI events
 */
export const haptics = {
  /**
   * Light tap feedback for button presses
   */
  tap: () => triggerHaptic("light"),

  /**
   * Medium feedback for selections or toggles
   */
  select: () => triggerHaptic("medium"),

  /**
   * Heavy feedback for important actions
   */
  impact: () => triggerHaptic("heavy"),

  /**
   * Success feedback for completed actions
   */
  success: () => triggerHaptic("success"),

  /**
   * Warning feedback for caution states
   */
  warning: () => triggerHaptic("warning"),

  /**
   * Error feedback for failures
   */
  error: () => triggerHaptic("error"),

  /**
   * Custom pattern feedback
   */
  custom: (pattern: number | number[]) => {
    if (isHapticSupported()) {
      try {
        navigator.vibrate(pattern);
      } catch (error) {
        console.warn("Custom haptic feedback failed:", error);
      }
    }
  },

  /**
   * Stop all vibrations
   */
  stop: () => {
    if (isHapticSupported()) {
      navigator.vibrate(0);
    }
  },
};

/**
 * Haptic feedback hooks for SolidJS
 * Use in components to trigger haptic feedback on events
 */
export function useHaptic() {
  return {
    isSupported: isHapticSupported(),
    ...haptics,
  };
}
