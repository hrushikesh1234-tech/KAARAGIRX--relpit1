import React from 'react';
import { Project } from '@/lib/types';

interface ProjectDetailsProps {
  project: Project;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">{project.name || project.title}</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <p className="text-gray-600 text-sm">Property Name</p>
          <p className="font-medium">{project.name || project.title}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Type</p>
          <p className="font-medium">{project.type || project.propertyType}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Budget</p>
          <p className="font-medium">
            {typeof project.budget === 'number' 
              ? `₹ ${project.budget.toLocaleString('en-IN')}` 
              : project.budget || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">BHK</p>
          <p className="font-medium">{project.bhk || 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Build Complete</p>
          <p className="font-medium">{project.completionDate || project.completionYear || 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Build Area</p>
          <p className="font-medium">
            {project.area 
              ? `${typeof project.area === 'number' ? project.area : project.area} sqft` 
              : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Location</p>
          <p className="font-medium">{project.location || 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Style</p>
          <p className="font-medium">{project.style || 'N/A'}</p>
        </div>
      </div>
      
      {project.description && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Project Description</h3>
          <p className="text-gray-700">{project.description}</p>
        </div>
      )}
      
      {project.images && project.images.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Project Gallery</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {project.images.map((image, index) => (
              <img 
                key={index} 
                src={typeof image === 'string' ? image : (image as any).imageUrl} 
                alt={`${project.name || project.title} - Image ${index + 1}`} 
                className="w-full h-64 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
