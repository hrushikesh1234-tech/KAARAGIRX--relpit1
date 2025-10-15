export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  reductionPercentage: number;
}

export const compressImage = async (
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> => {
  const {
    maxWidth = 1280,
    maxHeight = 720,
    quality = 0.55
  } = options;

  const originalSize = file.size;

  if (!file.type.startsWith('image/')) {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      reductionPercentage: 0
    };
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        if (width > height) {
          width = maxWidth;
          height = width / aspectRatio;
        } else {
          height = maxHeight;
          width = height * aspectRatio;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Image compression failed'));
            return;
          }

          const compressedFile = new File([blob], file.name, {
            type: file.type === 'image/png' ? 'image/jpeg' : file.type,
            lastModified: Date.now(),
          });

          const compressedSize = compressedFile.size;
          const reductionPercentage = Math.round(((originalSize - compressedSize) / originalSize) * 100);

          resolve({
            file: compressedFile,
            originalSize,
            compressedSize,
            reductionPercentage
          });
        },
        file.type === 'image/png' ? 'image/jpeg' : file.type,
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const uploadToLocal = async (
  file: File,
  onProgress?: (progress: UploadProgress) => void,
  compress: boolean = true
): Promise<string> => {
  try {
    let processedFile: File;
    if (compress) {
      const result = await compressImage(file);
      processedFile = result.file;
      console.log(`Image compressed: ${result.originalSize} → ${result.compressedSize} bytes (${result.reductionPercentage}% reduction)`);
    } else {
      processedFile = file;
    }
    const base64 = await fileToBase64(processedFile);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            onProgress({
              loaded: e.loaded,
              total: e.total,
              percentage: Math.round((e.loaded / e.total) * 100)
            });
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response.url);
          } catch (error) {
            reject(new Error('Invalid server response'));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'));
      });

      xhr.open('POST', '/api/upload');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({ image: base64 }));
    });
  } catch (error) {
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const uploadMultipleToLocal = async (
  files: File[],
  onProgress?: (index: number, progress: UploadProgress) => void,
  compress: boolean = true
): Promise<string[]> => {
  const uploadPromises = files.map(async (file, index) => {
    return uploadToLocal(
      file,
      onProgress ? (progress) => onProgress(index, progress) : undefined,
      compress
    );
  });

  return Promise.all(uploadPromises);
};
