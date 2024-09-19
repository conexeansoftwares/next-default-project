// utils/imageProcessing.ts
export const processImage = async (
  file: File,
  options: { maxWidth: number; maxHeight: number; quality: number }
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > options.maxWidth) {
        height *= options.maxWidth / width;
        width = options.maxWidth;
      }
      if (height > options.maxHeight) {
        width *= options.maxHeight / height;
        height = options.maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to process image'));
        },
        'image/jpeg',
        options.quality
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};
