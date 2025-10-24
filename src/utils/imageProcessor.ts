export interface ImageProcessResult {
  dataUri: string;
  width: number;
  height: number;
  size: number;
}

export class ImageProcessor {
  static async processAvatar(file: File): Promise<ImageProcessResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          const targetSize = 128;
          canvas.width = targetSize;
          canvas.height = targetSize;

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          const scale = Math.max(targetSize / img.width, targetSize / img.height);
          const x = (targetSize - img.width * scale) / 2;
          const y = (targetSize - img.height * scale) / 2;

          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

          const dataUri = canvas.toDataURL('image/png');
          const size = Math.round((dataUri.length * 3) / 4);

          if (size > 1024 * 1024) {
            reject(new Error('حجم تصویر پس از تبدیل بیش از حد مجاز است (حداکثر 1MB)'));
            return;
          }

          resolve({
            dataUri,
            width: targetSize,
            height: targetSize,
            size,
          });
        };

        img.onerror = () => {
          reject(new Error('خطا در بارگذاری تصویر'));
        };

        img.src = e.target?.result as string;
      };

      reader.onerror = () => {
        reject(new Error('خطا در خواندن فایل'));
      };

      reader.readAsDataURL(file);
    });
  }

  static validateImageFile(file: File): string | null {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];

    if (!validTypes.includes(file.type)) {
      return 'فرمت تصویر باید PNG، JPEG، GIF یا WebP باشد';
    }

    if (file.size > 10 * 1024 * 1024) {
      return 'حجم تصویر نباید بیشتر از 10MB باشد';
    }

    return null;
  }

  static async selectAndProcessAvatar(): Promise<ImageProcessResult | null> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/png,image/jpeg,image/jpg,image/gif,image/webp';

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          resolve(null);
          return;
        }

        const validationError = ImageProcessor.validateImageFile(file);
        if (validationError) {
          reject(new Error(validationError));
          return;
        }

        try {
          const result = await ImageProcessor.processAvatar(file);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      };

      input.click();
    });
  }
}
