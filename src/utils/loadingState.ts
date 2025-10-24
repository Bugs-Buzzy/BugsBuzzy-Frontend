/**
 * Manages loading screen state persistence
 * Loading screen should only show:
 * - On first visit
 * - After cache is cleared
 * - After a certain time has elapsed (24 hours)
 */

const LOADING_STATE_KEY = 'bugsbuzzy_loading_completed';
const LOADING_TIMESTAMP_KEY = 'bugsbuzzy_loading_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

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
