import { Cloudinary } from '@cloudinary/url-gen';
import { fill, scale } from '@cloudinary/url-gen/actions/resize';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { auto } from '@cloudinary/url-gen/qualifiers/format';
import { auto as autoQuality } from '@cloudinary/url-gen/qualifiers/quality';

if (!import.meta.env.VITE_CLOUDINARY_CLOUD_NAME) {
  console.warn('VITE_CLOUDINARY_CLOUD_NAME is not set. Cloudinary features will be disabled.');
}

export const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo'
  },
  url: {
    secure: true
  }
});

export const getOptimizedImageUrl = (publicId: string, width?: number, height?: number): string => {
  if (!import.meta.env.VITE_CLOUDINARY_CLOUD_NAME) {
    return publicId;
  }

  const image = cld.image(publicId)
    .delivery(format(auto()))
    .delivery(quality(autoQuality()));

  if (width && height) {
    image.resize(fill().width(width).height(height));
  } else if (width) {
    image.resize(scale().width(width));
  } else if (height) {
    image.resize(scale().height(height));
  }

  return image.toURL();
};

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export const uploadToCloudinary = async (
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration is missing');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress({
          loaded: e.loaded,
          total: e.total,
          percentage: Math.round((e.loaded / e.total) * 100)
        });
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response.secure_url);
      } else {
        reject(new Error('Upload failed'));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
    xhr.send(formData);
  });
};

export const uploadMultipleToCloudinary = async (
  files: File[],
  onProgress?: (index: number, progress: UploadProgress) => void
): Promise<string[]> => {
  const uploadPromises = files.map((file, index) => 
    uploadToCloudinary(file, (progress) => {
      if (onProgress) {
        onProgress(index, progress);
      }
    })
  );

  return Promise.all(uploadPromises);
};
