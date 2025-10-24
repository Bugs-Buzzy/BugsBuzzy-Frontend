import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { loadingStateManager } from './loadingState';

describe('loadingStateManager', () => {
  const originalPathname = window.location.pathname;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset pathname to root
    Object.defineProperty(window, 'location', {
      value: { pathname: '/' },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    // Restore original pathname
    Object.defineProperty(window, 'location', {
      value: { pathname: originalPathname },
      writable: true,
      configurable: true,
    });
  });

  it('should show loading on first visit to landing page', () => {
    const shouldShow = loadingStateManager.shouldShowLoading();
    expect(shouldShow).toBe(true);
  });

  it('should not show loading after marking completed', () => {
    loadingStateManager.markLoadingCompleted();
    const shouldShow = loadingStateManager.shouldShowLoading();
    expect(shouldShow).toBe(false);
  });

  it('should show loading after cache is cleared', () => {
    loadingStateManager.markLoadingCompleted();
    loadingStateManager.clearLoadingState();
    const shouldShow = loadingStateManager.shouldShowLoading();
    expect(shouldShow).toBe(true);
  });

  it('should show loading after 24 hours', () => {
    loadingStateManager.markLoadingCompleted();

    // Mock Date.now to simulate 25 hours passing
    const mockNow = Date.now() + 25 * 60 * 60 * 1000;
    const dateSpy = vi.spyOn(Date, 'now').mockImplementation(() => mockNow);

    const shouldShow = loadingStateManager.shouldShowLoading();
    expect(shouldShow).toBe(true);

    // Restore Date.now
    dateSpy.mockRestore();
  });

  it('should get time until next loading', () => {
    loadingStateManager.markLoadingCompleted();
    const timeRemaining = loadingStateManager.getTimeUntilNextLoading();

    // Should be close to 24 hours in milliseconds
    const expectedTime = 24 * 60 * 60 * 1000;
    expect(timeRemaining).toBeGreaterThan(expectedTime - 1000);
    expect(timeRemaining).toBeLessThanOrEqual(expectedTime);
  });

  it('should return 0 time remaining if never marked completed', () => {
    const timeRemaining = loadingStateManager.getTimeUntilNextLoading();
    expect(timeRemaining).toBe(0);
  });

  it('should handle localStorage errors gracefully', () => {
    // Mock localStorage to throw errors
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = vi.fn(() => {
      throw new Error('Storage error');
    });

    // Should not throw
    expect(() => loadingStateManager.markLoadingCompleted()).not.toThrow();

    // Restore
    Storage.prototype.setItem = originalSetItem;
  });

  it('should show loading on hard refresh (reload navigation type)', () => {
    // Mark loading as completed first
    loadingStateManager.markLoadingCompleted();

    // Mock performance.getEntriesByType to simulate hard refresh
    const mockNavEntry = {
      type: 'reload',
      name: 'navigation',
      entryType: 'navigation',
      startTime: 0,
      duration: 0,
    } as PerformanceNavigationTiming;

    const originalGetEntriesByType = performance.getEntriesByType;
    performance.getEntriesByType = vi.fn((type: string) => {
      if (type === 'navigation') {
        return [mockNavEntry];
      }
      return [];
    }) as any;

    const shouldShow = loadingStateManager.shouldShowLoading();
    expect(shouldShow).toBe(true);

    // Restore
    performance.getEntriesByType = originalGetEntriesByType;
  });

  it('should not show loading on normal navigation', () => {
    // Mark loading as completed first
    loadingStateManager.markLoadingCompleted();

    // Mock performance.getEntriesByType to simulate normal navigation
    const mockNavEntry = {
      type: 'navigate',
      name: 'navigation',
      entryType: 'navigation',
      startTime: 0,
      duration: 0,
    } as PerformanceNavigationTiming;

    const originalGetEntriesByType = performance.getEntriesByType;
    performance.getEntriesByType = vi.fn((type: string) => {
      if (type === 'navigation') {
        return [mockNavEntry];
      }
      return [];
    }) as any;

    const shouldShow = loadingStateManager.shouldShowLoading();
    expect(shouldShow).toBe(false);

    // Restore
    performance.getEntriesByType = originalGetEntriesByType;
  });

  it('should not show loading on panel routes', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/panel/dashboard' },
      writable: true,
      configurable: true,
    });

    const shouldShow = loadingStateManager.shouldShowLoading();
    expect(shouldShow).toBe(false);
  });

  it('should not show loading on payment routes', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/payment/success' },
      writable: true,
      configurable: true,
    });

    const shouldShow = loadingStateManager.shouldShowLoading();
    expect(shouldShow).toBe(false);
  });

  it('should not show loading when user is authenticated', () => {
    localStorage.setItem('access_token', 'fake-token');

    const shouldShow = loadingStateManager.shouldShowLoading();
    expect(shouldShow).toBe(false);
  });

  it('should not show loading on panel routes even with hard refresh', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/panel/dashboard' },
      writable: true,
      configurable: true,
    });

    // Mock performance.getEntriesByType to simulate hard refresh
    const mockNavEntry = {
      type: 'reload',
      name: 'navigation',
      entryType: 'navigation',
      startTime: 0,
      duration: 0,
    } as PerformanceNavigationTiming;

    const originalGetEntriesByType = performance.getEntriesByType;
    performance.getEntriesByType = vi.fn((type: string) => {
      if (type === 'navigation') {
        return [mockNavEntry];
      }
      return [];
    }) as any;

    const shouldShow = loadingStateManager.shouldShowLoading();
    expect(shouldShow).toBe(false);

    // Restore
    performance.getEntriesByType = originalGetEntriesByType;
  });

  it('should not show loading when authenticated even with hard refresh on landing page', () => {
    localStorage.setItem('access_token', 'fake-token');

    // Mock performance.getEntriesByType to simulate hard refresh
    const mockNavEntry = {
      type: 'reload',
      name: 'navigation',
      entryType: 'navigation',
      startTime: 0,
      duration: 0,
    } as PerformanceNavigationTiming;

    const originalGetEntriesByType = performance.getEntriesByType;
    performance.getEntriesByType = vi.fn((type: string) => {
      if (type === 'navigation') {
        return [mockNavEntry];
      }
      return [];
    }) as any;

    const shouldShow = loadingStateManager.shouldShowLoading();
    expect(shouldShow).toBe(false);

    // Restore
    performance.getEntriesByType = originalGetEntriesByType;
  });
});
