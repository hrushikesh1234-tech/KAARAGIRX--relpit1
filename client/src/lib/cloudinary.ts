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
