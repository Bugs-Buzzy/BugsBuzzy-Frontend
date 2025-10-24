/**
 * Manages loading screen state persistence
 * Loading screen should only show:
 * - On first visit
 * - After cache is cleared
 * - After a hard refresh (Ctrl+F5)
 * - After a certain time has elapsed (24 hours)
 */

const LOADING_STATE_KEY = 'bugsbuzzy_loading_completed';
const LOADING_TIMESTAMP_KEY = 'bugsbuzzy_loading_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Detect if this is a hard refresh (Ctrl+F5 or cache cleared)
 */
function isHardRefresh(): boolean {
  try {
    // Check if Performance API is available
    if (typeof performance === 'undefined') {
      return false;
    }

    // Use Performance Navigation API to detect reload type
    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0) {
      const navEntry = navigationEntries[0] as PerformanceNavigationTiming;
      // type === 'reload' indicates a refresh (F5 or Ctrl+F5)
      return navEntry.type === 'reload';
    }

    // Fallback for older browsers
    if (performance.navigation) {
      // TYPE_RELOAD = 1 indicates any type of reload
      return performance.navigation.type === 1;
    }

    return false;
  } catch {
    return false;
  }
}

export const loadingStateManager = {
  /**
   * Check if loading screen should be shown
   */
  shouldShowLoading(): boolean {
    try {
      const completed = localStorage.getItem(LOADING_STATE_KEY);
      const timestamp = localStorage.getItem(LOADING_TIMESTAMP_KEY);

      // If never completed, show loading
      if (!completed || !timestamp) {
        return true;
      }

      // Check if this is a hard refresh
      if (isHardRefresh()) {
        return true;
      }

      // Check if cache has expired
      const lastShown = parseInt(timestamp, 10);
      const now = Date.now();
      const elapsed = now - lastShown;

      // If more than cache duration has passed, show loading again
      if (elapsed > CACHE_DURATION) {
        return true;
      }

      return false;
    } catch {
      // If localStorage is not available or any error occurs, show loading
      return true;
    }
  },

  /**
   * Mark loading as completed
   */
  markLoadingCompleted(): void {
    try {
      localStorage.setItem(LOADING_STATE_KEY, 'true');
      localStorage.setItem(LOADING_TIMESTAMP_KEY, Date.now().toString());
    } catch {
      // Silently fail if localStorage is not available
    }
  },

  /**
   * Clear loading state (for testing or manual cache clearing)
   */
  clearLoadingState(): void {
    try {
      localStorage.removeItem(LOADING_STATE_KEY);
      localStorage.removeItem(LOADING_TIMESTAMP_KEY);
    } catch {
      // Silently fail if localStorage is not available
    }
  },

  /**
   * Get time until next loading screen
   */
  getTimeUntilNextLoading(): number {
    try {
      const timestamp = localStorage.getItem(LOADING_TIMESTAMP_KEY);
      if (!timestamp) {
        return 0;
      }

      const lastShown = parseInt(timestamp, 10);
      const now = Date.now();
      const elapsed = now - lastShown;
      const remaining = CACHE_DURATION - elapsed;

      return Math.max(0, remaining);
    } catch {
      return 0;
    }
  },
};
