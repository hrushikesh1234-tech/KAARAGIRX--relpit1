import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Project } from '@/lib/types';

// Mock data for projects
const mockProjects: Record<string, Project> = {
  '1': {
    id: 1,
    professionalId: 101,
    title: "BlueSky Bungalow",
    name: "BlueSky Bungalow",
    description: "A luxurious 4 BHK bungalow with modern design elements, spacious rooms, and a private pool.",
    propertyType: "Residential",
    type: "Bungalow",
    budget: 3500000,
    completionYear: "2024",
    completionDate: "2024",
    area: 1200,
    location: "Lonavala, Maharashtra",
    bhk: 4,
    style: "Modern Architecture",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600",
      "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=600",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600"
    ]
  },
  '2': {
    id: 2,
    professionalId: 101,
    title: "Oasis Apartments",
    name: "Oasis Apartments",
    description: "Complete interior renovation of a 3 BHK apartment with modern furnishings and smart home features.",
    propertyType: "Residential",
    type: "Interior Renovation",
    budget: 2000000,
    completionYear: "2022",
    completionDate: "2022",
    area: 950,
    location: "Pune, Maharashtra",
    bhk: 3,
    style: "Contemporary",
    coverImage: "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=600",
    images: [
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=600",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600"
    ]
  },
  '3': {
    id: 3,
    professionalId: 102,
    title: "Hotel Summit View",
    name: "Hotel Summit View",
    description: "Complete renovation of a boutique hotel including 25 rooms, lobby, restaurant, and rooftop lounge.",
    propertyType: "Commercial",
    type: "Hotel Renovation",
    budget: 40000000,
    completionYear: "2023",
    completionDate: "2023",
    area: 4500,
    location: "Mumbai, Maharashtra",
    style: "Contemporary Luxury",
    coverImage: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600",
    images: [
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600",
      "https://images.unsplash.com/photo-1600566752229-250b0347e0cd?w=600",
      "https://images.unsplash.com/photo-1600566752354-c5a8c4c85ad6?w=600"
    ]
  }
};

// Get a single project by ID
export const useProject = (id?: string) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      if (!id) return null;
      
      // For now, return mock data
      return mockProjects[id] || null;
      
      // In the future, this would be an API call
      // const response = await api.get(`/projects/${id}`);
      // return response.data;
    },
    enabled: !!id
  });
};

// Get projects by professional ID
export const useProfessionalProjects = (professionalId?: string | number) => {
  return useQuery({
    queryKey: ['professionalProjects', professionalId],
    queryFn: async () => {
      if (!professionalId) return [];
      
      const response = await fetch(`/api/projects/professional/${professionalId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch professional projects');
      }
      return response.json() as Promise<Project[]>;
    },
    enabled: !!professionalId
  });
};

// Create a new project
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectData: Partial<Project>) => {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create project');
      }
      
      return response.json() as Promise<Project>;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['professionalProjects', data.professionalId] });
    }
  });
};

// Update an existing project
export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...projectData }: Partial<Project> & { id: number }) => {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update project');
      }
      
      return response.json() as Promise<Project>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['project', String(data.id)] });
      queryClient.invalidateQueries({ queryKey: ['professionalProjects', data.professionalId] });
    }
  });
};

// Delete a project
export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, professionalId }: { id: number, professionalId: number }) => {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      
      return { success: true, id, professionalId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['professionalProjects', data.professionalId] });
    }
  });
};
