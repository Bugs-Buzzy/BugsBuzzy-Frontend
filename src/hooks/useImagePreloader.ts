import { useState, useEffect } from 'react';

/**
 * Hook to preload images before they're needed
 * Returns loading state and progress
 */
export function useImagePreloader(imageUrls: string[]) {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) {
      setLoaded(true);
      setProgress(100);
      return;
    }

    let loadedCount = 0;
    let isCancelled = false;

    const preloadImage = (url: string): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (!isCancelled) {
            loadedCount++;
            setProgress((loadedCount / imageUrls.length) * 100);
          }
          resolve();
        };
        img.onerror = () => {
          if (!isCancelled) {
            loadedCount++;
            setProgress((loadedCount / imageUrls.length) * 100);
          }
          // Don't reject - we still want to continue loading other images
          resolve();
        };
        img.src = url;
      });
    };

    const loadAllImages = async () => {
      try {
        await Promise.all(imageUrls.map((url) => preloadImage(url)));
        if (!isCancelled) {
          setLoaded(true);
          setProgress(100);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err : new Error('Failed to load images'));
        }
      }
    };

    loadAllImages();

    return () => {
      isCancelled = true;
    };
  }, [imageUrls]);

  return { loaded, progress, error };
}
