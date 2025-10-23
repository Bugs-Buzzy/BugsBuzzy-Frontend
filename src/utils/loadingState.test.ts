import { describe, it, expect, beforeEach, vi } from 'vitest';

import { loadingStateManager } from './loadingState';

describe('loadingStateManager', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should show loading on first visit', () => {
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
});
