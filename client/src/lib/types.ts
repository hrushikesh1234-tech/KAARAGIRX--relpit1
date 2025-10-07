export interface Professional {
  id: number;
  userId: number;
  fullName?: string;
  companyName?: string;
  address: string;
  pincode: string;
  phone: string;
  profession: 'contractor' | 'architect';
  experience: number;
  profileImage?: string;
  about?: string;
  rating: number;
  reviewCount: number;
  location: string;
  specializations?: string[];
  projects?: Project[];
  isVerified?: boolean;
  availability?: 'Available' | 'Busy' | 'Away';
  completedProjects?: number;
  responseTime?: string;
}

export interface Project {
  id: number;
  professionalId: number;
  title: string;
  name: string;
  description?: string;
  propertyType: string;
  type: string;
  budget?: string | number;
  completionYear?: string;
  completionDate?: string;
  area?: string | number;
  location?: string;
  bhk?: number;
  style?: string;
  coverImage?: string;
  images?: ProjectImage[] | string[];
}

export interface ProjectImage {
  id: number;
  projectId: number;
  imageUrl: string;
  sortOrder: number;
}

export interface Review {
  id: number;
  professionalId: number;
  userId: number;
  userFullName?: string;
  rating: number;
  content?: string;
  createdAt: Date;
}

export interface Bookmark {
  bookmarkId: number;
  professional: Professional;
}

// Authentication types
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  userType: 'customer' | 'contractor' | 'architect' | 'material_dealer' | 'rental_merchant' | 'admin';
  phone?: string;
  address?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  userType: 'customer' | 'contractor' | 'architect' | 'material_dealer' | 'rental_merchant' | 'admin';
}

export type ProfessionalData = {
  companyName?: string;
  address: string;
  pincode: string;
  phone: string;
  experience: number;
  profileImage?: string;
  about?: string;
  location: string;
  specializations?: string[];
};

export type ProfessionalFilter = {
  profession?: string;
  location?: string;
  specialization?: string;
  sortBy?: string;
  search?: string;
};
