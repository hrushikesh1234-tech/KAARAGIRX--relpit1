import { useState } from "react";
import { ProjectImage } from "@/lib/types";

interface ProjectGalleryProps {
  images: ProjectImage[];
}

const ProjectGallery = ({ images }: ProjectGalleryProps) => {
  const [activeImage, setActiveImage] = useState<string | undefined>(
    images.length > 0 ? images[0].imageUrl : undefined
  );

  if (images.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No images available for this project.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Featured Image */}
      <div className="mb-6">
        <div className="aspect-video overflow-hidden rounded-lg">
          {activeImage ? (
            <img 
              src={activeImage} 
              alt="Project Featured" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div 
            key={image.id || index}
            className={`aspect-square overflow-hidden rounded-lg cursor-pointer ${
              image.imageUrl === activeImage ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setActiveImage(image.imageUrl)}
          >
            <img 
              src={image.imageUrl} 
              alt={`Project Image ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectGallery;
