import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Professional, ProfessionalFilter } from "@/lib/types";

export function useProfessionals(filters?: ProfessionalFilter) {
  // Build query params
  const queryParams = new URLSearchParams();
  
  if (filters) {
    if (filters.profession) queryParams.append("profession", filters.profession);
    if (filters.location) queryParams.append("location", filters.location);
    if (filters.specialization) queryParams.append("specialization", filters.specialization);
    if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
    if (filters.search) queryParams.append("search", filters.search);
  }
  
  const queryString = queryParams.toString();
  const url = `/api/professionals${queryString ? `?${queryString}` : ''}`;
  
  return useQuery<Professional[]>({
    queryKey: ["professionals", filters],
    queryFn: () => fetch(url, { credentials: "include" }).then(res => res.json()),
  });
}

export function useFeaturedProfessionals(profession?: string, limit: number = 5) {
  return useQuery<Professional[]>({
    queryKey: ["featuredProfessionals", profession, limit],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      
      if (profession) {
        queryParams.append("profession", profession);
      }
      if (limit) {
        queryParams.append("limit", limit.toString());
      }
      queryParams.append("featured", "true");
      
      const queryString = queryParams.toString();
      const url = `/api/professionals${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) {
        throw new Error("Failed to fetch featured professionals");
      }
      
      return response.json();
    },
  });
}

export function useProfessional(id: number | string | undefined) {
  return useQuery<Professional | null>({
    queryKey: ["professional", id],
    queryFn: async () => {
      if (!id) return null;
      
      // Mock data for professionals
      const mockProfessionals: Record<string, Professional> = {
        '101': {
          id: 101,
          userId: 1001,
          fullName: "Rajesh Sharma",
          companyName: "Sharma Constructions",
          address: "123 MG Road",
          pincode: "411001",
          phone: "+91 9876543210",
          profession: "contractor",
          experience: 15,
          profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256",
          about: "Sharma Constructions is a leading construction company with over 15 years of experience in building high-quality residential and commercial properties. We specialize in bungalow construction, interior renovation, and office spaces.",
          rating: 4.5,
          reviewCount: 48,
          location: "Lonavala, Maharashtra",
          specializations: ["Bungalow Construction", "Interior Renovation", "Office Spaces"],
          projects: [
            {
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
            {
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
            }
          ]
        },
        '102': {
          id: 102,
          userId: 1002,
          fullName: "Priya Patel",
          companyName: "Patel Architects",
          address: "456 FC Road",
          pincode: "411005",
          phone: "+91 9876543211",
          profession: "architect",
          experience: 12,
          profileImage: "https://images.unsplash.com/photo-1573496359142-b8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256",
          about: "Patel Architects is a creative architecture firm with a focus on sustainable and innovative design. With 12 years of experience, we have completed numerous projects ranging from residential homes to commercial complexes.",
          rating: 4.8,
          reviewCount: 36,
          location: "Pune, Maharashtra",
          specializations: ["Residential Architecture", "Green Building Design", "Commercial Spaces"],
          projects: [
            {
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
          ]
        },
        '103': {
          id: 103,
          userId: 1003,
          fullName: "Vikram Singh",
          companyName: "Modern Builders",
          address: "789 SB Road",
          pincode: "411016",
          phone: "+91 9876543212",
          profession: "contractor",
          experience: 10,
          profileImage: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256",
          about: "Modern Builders specializes in contemporary construction solutions with a focus on quality and timely delivery. With 10 years in the industry, we have built a reputation for excellence in residential and commercial projects.",
          rating: 4.2,
          reviewCount: 27,
          location: "Mumbai, Maharashtra",
          specializations: ["Residential Buildings", "Commercial Construction", "Renovation"],
          projects: []
        },
        '104': {
          id: 104,
          userId: 1004,
          fullName: "Ananya Desai",
          companyName: "Desai Design Studio",
          address: "321 Koregaon Park",
          pincode: "411001",
          phone: "+91 9876543213",
          profession: "architect",
          experience: 8,
          profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256",
          about: "Desai Design Studio is a young and dynamic architecture firm that combines traditional elements with modern design principles. We specialize in creating spaces that are both functional and aesthetically pleasing.",
          rating: 4.6,
          reviewCount: 19,
          location: "Pune, Maharashtra",
          specializations: ["Residential Design", "Interior Architecture", "Landscape Design"],
          projects: []
        },
        '105': {
          id: 105,
          userId: 1005,
          fullName: "Arjun Mehta",
          companyName: "Mehta & Associates",
          address: "567 Baner Road",
          pincode: "411045",
          phone: "+91 9876543214",
          profession: "contractor",
          experience: 20,
          profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256",
          about: "Mehta & Associates is a veteran in the construction industry with 20 years of experience. We have completed over 100 projects across Maharashtra, specializing in high-end residential and commercial construction.",
          rating: 4.9,
          reviewCount: 62,
          location: "Mumbai, Maharashtra",
          specializations: ["Luxury Homes", "Commercial Buildings", "Industrial Construction"],
          projects: []
        },
        // Add featured architects
        '201': {
          id: 201,
          userId: 301,
          fullName: "Neha Kapoor",
          companyName: "Kapoor Design Studio",
          address: "34 Creative Lane, Kamshet",
          pincode: "410405",
          phone: "+91-9876543220",
          profession: "architect",
          experience: 10,
          profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          about: "Award-winning architect specializing in sustainable and eco-friendly designs for mountain homes.",
          rating: 4.9,
          reviewCount: 32,
          location: "Kamshet, Maharashtra",
          specializations: ["Sustainable Design", "Eco-friendly", "Mountain Homes"],
          projects: [
            {
              id: 4,
              professionalId: 201,
              title: "Eco Mountain Retreat",
              name: "Eco Mountain Retreat",
              description: "A sustainable mountain home with solar panels, rainwater harvesting, and natural materials.",
              propertyType: "Residential",
              type: "Mountain Home",
              budget: 5000000,
              completionYear: "2023",
              completionDate: "2023",
              area: 2200,
              location: "Kamshet, Maharashtra",
              bhk: 3,
              style: "Eco-friendly",
              coverImage: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600",
              images: [
                "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600",
                "https://images.unsplash.com/photo-1600566752229-250b0347e0cd?w=600",
                "https://images.unsplash.com/photo-1600566752354-c5a8c4c85ad6?w=600",
                "https://images.unsplash.com/photo-1600566752584-5ec6fe7d2d7e?w=600"
              ]
            }
          ]
        },
        '202': {
          id: 202,
          userId: 302,
          fullName: "Arjun Reddy",
          companyName: "Reddy Architecture",
          address: "12 Design Street, Lonavala",
          pincode: "410401",
          phone: "+91-9876543221",
          profession: "architect",
          experience: 14,
          profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          about: "Contemporary design specialist with focus on blending modern aesthetics with traditional elements.",
          rating: 4.7,
          reviewCount: 41,
          location: "Lonavala, Maharashtra",
          specializations: ["Contemporary", "Fusion Design", "Luxury Villas"],
          projects: [
            {
              id: 5,
              professionalId: 202,
              title: "Fusion Villa",
              name: "Fusion Villa",
              description: "A luxury villa that blends modern aesthetics with traditional Indian elements.",
              propertyType: "Residential",
              type: "Luxury Villa",
              budget: 7500000,
              completionYear: "2022",
              completionDate: "2022",
              area: 3500,
              location: "Lonavala, Maharashtra",
              bhk: 5,
              style: "Contemporary Fusion",
              coverImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600",
              images: [
                "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600",
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600",
                "https://images.unsplash.com/photo-1600607687644-c7171b46f01f?w=600",
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600"
              ]
            }
          ]
        },
        '203': {
          id: 203,
          userId: 303,
          fullName: "Meera Iyer",
          companyName: "Green Earth Architects",
          address: "89 Eco Road, Kamshet",
          pincode: "410405",
          phone: "+91-9876543222",
          profession: "architect",
          experience: 9,
          profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          about: "Passionate about sustainable architecture with expertise in passive solar design and natural materials.",
          rating: 4.8,
          reviewCount: 27,
          location: "Kamshet, Maharashtra",
          specializations: ["Sustainable", "Passive Solar", "Natural Materials"],
          projects: [
            {
              id: 6,
              professionalId: 203,
              title: "Passive Solar Home",
              name: "Passive Solar Home",
              description: "A home designed to maximize natural heating and cooling through passive solar principles.",
              propertyType: "Residential",
              type: "Eco Home",
              budget: 4200000,
              completionYear: "2023",
              completionDate: "2023",
              area: 1800,
              location: "Kamshet, Maharashtra",
              bhk: 3,
              style: "Sustainable Modern",
              coverImage: "https://images.unsplash.com/photo-1600566753376-12c8ab8e317f?w=600",
              images: [
                "https://images.unsplash.com/photo-1600566753376-12c8ab8e317f?w=600",
                "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600",
                "https://images.unsplash.com/photo-1600566752734-2a0cd53cbd6a?w=600",
                "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=600"
              ]
            }
          ]
        },
        '204': {
          id: 204,
          userId: 304,
          fullName: "Karan Malhotra",
          companyName: "Malhotra & Associates",
          address: "45 Premium Avenue, Pune",
          pincode: "411001",
          phone: "+91-9876543223",
          profession: "architect",
          experience: 16,
          profileImage: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          about: "Luxury home specialist with international experience and expertise in high-end finishes and materials.",
          rating: 4.9,
          reviewCount: 38,
          location: "Pune, Maharashtra",
          specializations: ["Luxury Homes", "International Style", "High-end Finishes"],
          projects: [
            {
              id: 7,
              professionalId: 204,
              title: "Luxury Penthouse",
              name: "Luxury Penthouse",
              description: "A high-end penthouse with premium finishes, smart home features, and panoramic views.",
              propertyType: "Residential",
              type: "Penthouse",
              budget: 12000000,
              completionYear: "2022",
              completionDate: "2022",
              area: 4000,
              location: "Pune, Maharashtra",
              bhk: 4,
              style: "Contemporary Luxury",
              coverImage: "https://images.unsplash.com/photo-1600566752791-36c7ea9c4a5b?w=600",
              images: [
                "https://images.unsplash.com/photo-1600566752791-36c7ea9c4a5b?w=600",
                "https://images.unsplash.com/photo-1600566753543-9c6a433345a5?w=600",
                "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600"
              ]
            }
          ]
        },
        '205': {
          id: 205,
          userId: 305,
          fullName: "Ananya Sharma",
          companyName: "Innovative Spaces",
          address: "23 Creative Hub, Mumbai",
          pincode: "400001",
          phone: "+91-9876543224",
          profession: "architect",
          experience: 11,
          profileImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          about: "Innovative architect specializing in space optimization and creative solutions for urban living.",
          rating: 4.6,
          reviewCount: 33,
          location: "Mumbai, Maharashtra",
          specializations: ["Urban Design", "Space Optimization", "Creative Solutions"],
          projects: [
            {
              id: 8,
              professionalId: 205,
              title: "Urban Compact Home",
              name: "Urban Compact Home",
              description: "A smartly designed compact home that maximizes space efficiency in an urban setting.",
              propertyType: "Residential",
              type: "Urban Home",
              budget: 3800000,
              completionYear: "2023",
              completionDate: "2023",
              area: 900,
              location: "Mumbai, Maharashtra",
              bhk: 2,
              style: "Modern Urban",
              coverImage: "https://images.unsplash.com/photo-1600047509782-20d39509f26d?w=600",
              images: [
                "https://images.unsplash.com/photo-1600047509782-20d39509f26d?w=600",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
                "https://images.unsplash.com/photo-1600607687644-c7171b46f01f?w=600",
                "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600"
              ]
            }
          ]
        },
        // Add professionals from the listing page
        '1': {
          id: 1,
          userId: 101,
          companyName: 'BuildRight Contractors',
          fullName: 'BuildRight Contractors',
          address: 'Kamshet Main Road',
          pincode: '410405',
          phone: '+91 9876543210',
          profession: 'contractor',
          experience: 15,
          profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
          about: 'Experienced residential and commercial builder with a focus on quality construction and timely delivery. We specialize in custom homes, renovations, and commercial buildings.',
          rating: 4.8,
          reviewCount: 45,
          location: 'Kamshet, Maharashtra',
          specializations: ['Residential Construction', 'Commercial Buildings'],
          projects: [
            {
              id: 101,
              professionalId: 1,
              title: "Hillside Villa",
              name: "Hillside Villa",
              description: "A luxury villa built on a hillside with panoramic views, featuring 5 bedrooms, infinity pool, and smart home technology.",
              propertyType: "Residential",
              type: "Villa",
              budget: 8500000,
              completionYear: "2023",
              completionDate: "2023",
              area: 4200,
              location: "Kamshet, Maharashtra",
              bhk: 5,
              style: "Contemporary",
              coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
              images: [
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600",
                "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=600",
                "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600"
              ]
            }
          ]
        },
        '2': {
          id: 2,
          userId: 102,
          companyName: 'Stalwart Builders',
          fullName: 'Stalwart Builders',
          address: 'Lonavala Highway',
          pincode: '410401',
          phone: '+91 9876543211',
          profession: 'contractor',
          experience: 12,
          profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
          about: 'Quality construction services for all projects, from residential homes to commercial complexes. We pride ourselves on attention to detail and customer satisfaction.',
          rating: 4.6,
          reviewCount: 38,
          location: 'Lonavala, Maharashtra',
          specializations: ['Renovations', 'Commercial Buildings'],
          projects: [
            {
              id: 102,
              professionalId: 2,
              title: "Commercial Complex",
              name: "Commercial Complex",
              description: "A modern commercial complex with retail spaces, offices, and amenities like parking and cafeteria.",
              propertyType: "Commercial",
              type: "Commercial Building",
              budget: 25000000,
              completionYear: "2022",
              completionDate: "2022",
              area: 12000,
              location: "Lonavala, Maharashtra",
              style: "Modern",
              coverImage: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600",
              images: [
                "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600",
                "https://images.unsplash.com/photo-1600566752229-250b0347e0cd?w=600",
                "https://images.unsplash.com/photo-1600566752354-c5a8c4c85ad6?w=600",
                "https://images.unsplash.com/photo-1600566752584-5ec6fe7d2d7e?w=600"
              ]
            }
          ]
        },
        '3': {
          id: 3,
          userId: 103,
          companyName: 'HomeCrafters',
          fullName: 'HomeCrafters',
          address: 'Kamshet Circle',
          pincode: '410405',
          phone: '+91 9876543212',
          profession: 'contractor',
          experience: 18,
          profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
          about: 'Custom home building and renovations with a focus on craftsmanship and quality materials. We create homes that reflect your personality and lifestyle.',
          rating: 4.9,
          reviewCount: 52,
          location: 'Kamshet, Maharashtra',
          specializations: ['Custom Homes', 'Renovations'],
          projects: [
            {
              id: 103,
              professionalId: 3,
              title: "Mountain Retreat",
              name: "Mountain Retreat",
              description: "A rustic yet modern mountain home with natural materials, large windows, and outdoor living spaces.",
              propertyType: "Residential",
              type: "Mountain Home",
              budget: 6500000,
              completionYear: "2023",
              completionDate: "2023",
              area: 3200,
              location: "Kamshet, Maharashtra",
              bhk: 4,
              style: "Rustic Modern",
              coverImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600",
              images: [
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600",
                "https://images.unsplash.com/photo-1600607687644-c7171b46f01f?w=600",
                "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600",
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600"
              ]
            }
          ]
        },
        '4': {
          id: 4,
          userId: 104,
          companyName: 'DesignBuild Architects',
          fullName: 'DesignBuild Architects',
          address: 'Pune-Mumbai Highway',
          pincode: '410401',
          phone: '+91 9876543213',
          profession: 'architect',
          experience: 10,
          profileImage: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop',
          about: 'Full-service architecture firm specializing in sustainable design, residential architecture, and commercial spaces. We blend aesthetics with functionality.',
          rating: 4.7,
          reviewCount: 33,
          location: 'Lonavala, Maharashtra',
          specializations: ['Sustainable Design', 'Residential Architecture'],
          projects: [
            {
              id: 104,
              professionalId: 4,
              title: "Eco-Friendly Residence",
              name: "Eco-Friendly Residence",
              description: "A sustainable home with solar panels, rainwater harvesting, natural ventilation, and locally sourced materials.",
              propertyType: "Residential",
              type: "Eco Home",
              budget: 7000000,
              completionYear: "2022",
              completionDate: "2022",
              area: 2800,
              location: "Lonavala, Maharashtra",
              bhk: 3,
              style: "Sustainable Modern",
              coverImage: "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=600",
              images: [
                "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=600",
                "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600",
                "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600",
                "https://images.unsplash.com/photo-1600566753104-685f4f24cb4d?w=600"
              ]
            }
          ]
        },
        '5': {
          id: 5,
          userId: 105,
          companyName: 'Modern Spaces',
          fullName: 'Modern Spaces',
          address: 'Kamshet Hills',
          pincode: '410405',
          phone: '+91 9876543214',
          profession: 'architect',
          experience: 14,
          profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
          about: 'Contemporary architecture with a focus on clean lines, open spaces, and integration with nature. We create homes that are both beautiful and functional.',
          rating: 4.8,
          reviewCount: 41,
          location: 'Kamshet, Maharashtra',
          specializations: ['Contemporary Design', 'Residential Architecture'],
          projects: [
            {
              id: 105,
              professionalId: 5,
              title: "Glass House",
              name: "Glass House",
              description: "A modern home with extensive use of glass, creating a seamless indoor-outdoor connection with stunning views.",
              propertyType: "Residential",
              type: "Modern Home",
              budget: 9000000,
              completionYear: "2023",
              completionDate: "2023",
              area: 3500,
              location: "Kamshet, Maharashtra",
              bhk: 4,
              style: "Contemporary",
              coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
              images: [
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600",
                "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=600",
                "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600"
              ]
            }
          ]
        },
        '7': {
          id: 7,
          userId: 107,
          companyName: 'Premier Construction',
          fullName: 'Premier Construction',
          address: 'Kamshet Station Road',
          pincode: '410405',
          phone: '+91 9876543216',
          profession: 'contractor',
          experience: 10,
          profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
          about: 'Specializing in premium housing solutions with high-end finishes and materials. We create luxury homes that exceed expectations.',
          rating: 4.7,
          reviewCount: 41,
          location: 'Kamshet, Maharashtra',
          specializations: ['Luxury Homes', 'Premium Construction'],
          projects: [
            {
              id: 107,
              professionalId: 7,
              title: "Luxury Lakeside Villa",
              name: "Luxury Lakeside Villa",
              description: "A premium villa with lake views, featuring high-end finishes, smart home technology, and custom design elements.",
              propertyType: "Residential",
              type: "Luxury Villa",
              budget: 15000000,
              completionYear: "2023",
              completionDate: "2023",
              area: 5500,
              location: "Kamshet, Maharashtra",
              bhk: 6,
              style: "Contemporary Luxury",
              coverImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600",
              images: [
                "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600",
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600",
                "https://images.unsplash.com/photo-1600607687644-c7171b46f01f?w=600",
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600"
              ]
            }
          ]
        },
        '8': {
          id: 8,
          userId: 108,
          companyName: 'HillTop Builders',
          fullName: 'HillTop Builders',
          address: 'Lonavala-Khandala Road',
          pincode: '410401',
          phone: '+91 9876543217',
          profession: 'contractor',
          experience: 14,
          profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
          about: 'Hill station building specialists with expertise in difficult terrains. We design and build homes that are both beautiful and structurally sound in challenging landscapes.',
          rating: 4.5,
          reviewCount: 36,
          location: 'Lonavala, Maharashtra',
          specializations: ['Hillside Construction', 'Weather-resistant Buildings'],
          projects: [
            {
              id: 108,
              professionalId: 8,
              title: "Mountain Edge Home",
              name: "Mountain Edge Home",
              description: "A stunning home built on a steep hillside with panoramic valley views, featuring earthquake-resistant construction and weather-proof materials.",
              propertyType: "Residential",
              type: "Hillside Home",
              budget: 9500000,
              completionYear: "2022",
              completionDate: "2022",
              area: 3800,
              location: "Lonavala, Maharashtra",
              bhk: 4,
              style: "Mountain Contemporary",
              coverImage: "https://images.unsplash.com/photo-1600566753376-12c8ab8e317f?w=600",
              images: [
                "https://images.unsplash.com/photo-1600566753376-12c8ab8e317f?w=600",
                "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600",
                "https://images.unsplash.com/photo-1600566752734-2a0cd53cbd6a?w=600",
                "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=600"
              ]
            }
          ]
        },
        '9': {
          id: 9,
          userId: 109,
          companyName: 'EcoVista Constructions',
          fullName: 'EcoVista Constructions',
          address: 'Green Valley, Kamshet',
          pincode: '410405',
          phone: '+91 9876543218',
          profession: 'contractor',
          experience: 8,
          profileImage: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=400&fit=crop',
          about: 'Eco-friendly construction using sustainable materials. We build homes that minimize environmental impact while maximizing comfort and efficiency.',
          rating: 4.9,
          reviewCount: 32,
          location: 'Kamshet, Maharashtra',
          specializations: ['Sustainable Construction', 'Green Buildings'],
          projects: [
            {
              id: 109,
              professionalId: 9,
              title: "Sustainable Farmhouse",
              name: "Sustainable Farmhouse",
              description: "An eco-friendly farmhouse built with sustainable materials, featuring solar power, rainwater harvesting, and organic gardens.",
              propertyType: "Residential",
              type: "Farmhouse",
              budget: 7200000,
              completionYear: "2023",
              completionDate: "2023",
              area: 4000,
              location: "Kamshet, Maharashtra",
              bhk: 3,
              style: "Eco-Rustic",
              coverImage: "https://images.unsplash.com/photo-1600566752791-36c7ea9c4a5b?w=600",
              images: [
                "https://images.unsplash.com/photo-1600566752791-36c7ea9c4a5b?w=600",
                "https://images.unsplash.com/photo-1600566753543-9c6a433345a5?w=600",
                "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600"
              ]
            }
          ]
        },
        '10': {
          id: 10,
          userId: 110,
          companyName: 'Foundation Masters',
          fullName: 'Foundation Masters',
          address: 'Civil Lines, Pune',
          pincode: '411001',
          phone: '+91 9876543219',
          profession: 'contractor',
          experience: 20,
          profileImage: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&h=400&fit=crop',
          about: 'Foundation and structural experts for all building types. We ensure the structural integrity and safety of buildings in all terrains and conditions.',
          rating: 4.8,
          reviewCount: 75,
          location: 'Pune, Maharashtra',
          specializations: ['Foundations', 'Structural Engineering'],
          projects: [
            {
              id: 110,
              professionalId: 10,
              title: "High-Rise Apartment Complex",
              name: "High-Rise Apartment Complex",
              description: "A 15-story apartment complex with advanced foundation and structural systems designed for seismic stability and durability.",
              propertyType: "Residential",
              type: "Apartment Complex",
              budget: 85000000,
              completionYear: "2022",
              completionDate: "2022",
              area: 25000,
              location: "Pune, Maharashtra",
              style: "Modern High-Rise",
              coverImage: "https://images.unsplash.com/photo-1600047509782-20d39509f26d?w=600",
              images: [
                "https://images.unsplash.com/photo-1600047509782-20d39509f26d?w=600",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
                "https://images.unsplash.com/photo-1600607687644-c7171b46f01f?w=600",
                "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600"
              ]
            }
          ]
        },
        '6': {
          id: 6,
          userId: 106,
          companyName: 'Urban Planners',
          fullName: 'Urban Planners',
          address: 'Metro Complex, Pune',
          pincode: '411001',
          phone: '+91 9876543215',
          profession: 'architect',
          experience: 14,
          profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
          about: 'Specialized in urban planning and community spaces. We design buildings and spaces that enhance community interaction and urban living.',
          rating: 4.5,
          reviewCount: 42,
          location: 'Pune, Maharashtra',
          specializations: ['Urban Planning', 'Community Spaces', 'Commercial Architecture'],
          projects: [
            {
              id: 106,
              professionalId: 6,
              title: "Community Center",
              name: "Community Center",
              description: "A multi-purpose community center with spaces for events, classes, recreation, and social gatherings.",
              propertyType: "Commercial",
              type: "Community Space",
              budget: 18000000,
              completionYear: "2022",
              completionDate: "2022",
              area: 8500,
              location: "Pune, Maharashtra",
              style: "Modern Community",
              coverImage: "https://images.unsplash.com/photo-1600607687968-501f1887dd3c?w=600",
              images: [
                "https://images.unsplash.com/photo-1600607687968-501f1887dd3c?w=600",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600",
                "https://images.unsplash.com/photo-1600573472498-8a62ff29eeab?w=600"
              ]
            }
          ]
        }
      };

      // Check if the ID exists in the mock data
      if (mockProfessionals[id]) {
        return mockProfessionals[id];
      }
      
      // If not found, return null
      return null;
    },
    enabled: !!id,
  });
}

export function useProfessionalReviews(professionalId: number | string | undefined) {
  return useQuery({
    queryKey: ["professionalReviews", professionalId],
    queryFn: async () => {
      if (!professionalId) return [];
      
      // Mock reviews data
      const mockReviews = [
        {
          id: 1,
          professionalId: 101,
          userId: 2001,
          rating: 5,
          comment: "Excellent work! Rajesh and his team completed our bungalow on time and with great attention to detail. Highly recommended!",
          createdAt: "2024-01-15T10:30:00Z",
          projectName: "BlueSky Bungalow",
          user: {
            name: "Anita Verma",
            profileImage: "https://randomuser.me/api/portraits/women/44.jpg"
          }
        },
        {
          id: 2,
          professionalId: 101,
          userId: 2002,
          rating: 4,
          comment: "Good quality work and professional team. The only reason for 4 stars is a slight delay in completion.",
          createdAt: "2023-11-20T14:15:00Z",
          projectName: "Oasis Apartments",
          user: {
            name: "Sunil Kapoor",
            profileImage: "https://randomuser.me/api/portraits/men/32.jpg"
          }
        },
        {
          id: 3,
          professionalId: 102,
          userId: 2003,
          rating: 5,
          comment: "Priya's design for our hotel was innovative and exactly what we were looking for. The space utilization is brilliant!",
          createdAt: "2023-08-05T09:45:00Z",
          projectName: "Hotel Summit View",
          user: {
            name: "Rahul Mehta",
            profileImage: "https://randomuser.me/api/portraits/men/22.jpg"
          }
        }
      ];
      
      // Filter reviews for the requested professional
      return mockReviews.filter(review => review.professionalId === Number(professionalId));
      
      // In the future, this would be an API call
      // const response = await fetch(`/api/professionals/${professionalId}/reviews`, { credentials: "include" });
      // return response.json();
    },
    enabled: !!professionalId
  });
}

export function useCreateProfessional() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/professionals", data).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
    },
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ professionalId, data }: { professionalId: number, data: any }) => 
      apiRequest("POST", `/api/professionals/${professionalId}/reviews`, data).then(res => res.json()),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/professionals/${variables.professionalId}/reviews`] });
      queryClient.invalidateQueries({ queryKey: [`/api/professionals/${variables.professionalId}`] });
    },
  });
}
