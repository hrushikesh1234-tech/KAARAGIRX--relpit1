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
      
      const response = await fetch(`/api/professionals/${id}`, {
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch professional");
      }
      
      return response.json();
    },
    enabled: !!id,
  });
}

export function useProfessionalReviews(professionalId: number | string | undefined) {
  return useQuery({
    queryKey: ["professionalReviews", professionalId],
    queryFn: async () => {
      if (!professionalId) return [];
      
      const response = await fetch(`/api/professionals/${professionalId}/reviews`, {
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      
      return response.json();
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
      // Invalidate professional reviews for both public and own dashboard
      queryClient.invalidateQueries({ queryKey: ["professionalReviews", variables.professionalId] });
      queryClient.invalidateQueries({ queryKey: ["professionalReviews", String(variables.professionalId)] });
      
      // Invalidate professional data to update review count
      queryClient.invalidateQueries({ queryKey: ["professional", variables.professionalId] });
      queryClient.invalidateQueries({ queryKey: ["professional", String(variables.professionalId)] });
      
      // Invalidate user's professional reviews (for their dashboard)
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
    },
  });
}
