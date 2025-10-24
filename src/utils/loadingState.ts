/**
 * Manages loading screen state persistence
 * Loading screen should only show:
 * - On first visit to the landing page
 * - On page reload (F5 or Ctrl+F5) when on the landing page
 * - After a certain time has elapsed (24 hours) when on the landing page
 * - Never show on panel routes or when user is authenticated
 */

const LOADING_STATE_KEY = 'bugsbuzzy_loading_completed';
const LOADING_TIMESTAMP_KEY = 'bugsbuzzy_loading_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const AUTH_TOKEN_KEY = 'access_token'; // Must match authService token key

/**
 * Detect if this is a page reload (F5 or Ctrl+F5)
 * Note: The Performance Navigation API cannot distinguish between soft (F5) and hard (Ctrl+F5) refresh
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
      // type === 'reload' indicates any page reload (F5 or Ctrl+F5)
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

/**
 * Check if user is currently authenticated
 */
function isAuthenticated(): boolean {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    return !!token;
  } catch {
    return false;
  }
}

/**
 * Check if current path is a panel route or protected route
 */
function isOnProtectedRoute(): boolean {
  try {
    const path = window.location.pathname;
    return path.startsWith('/panel') || path.startsWith('/payment');
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
      // Never show loading screen on protected routes (panel, payment)
      if (isOnProtectedRoute()) {
        return false;
      }

      // Never show loading screen if user is authenticated (even on landing page refresh)
      if (isAuthenticated()) {
        return false;
      }

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
      // If localStorage is not available or any error occurs, show loading only on landing page
      return !isOnProtectedRoute() && !isAuthenticated();
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
