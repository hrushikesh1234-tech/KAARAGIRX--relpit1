import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dealer } from "@/types/dealer.types";

interface DealerFilters {
  category?: string;
  subcategory?: string;
  location?: string;
  search?: string;
}

export function useDealers(filters?: DealerFilters) {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    if (filters.category) queryParams.append("category", filters.category);
    if (filters.subcategory) queryParams.append("subcategory", filters.subcategory);
    if (filters.location) queryParams.append("location", filters.location);
    if (filters.search) queryParams.append("search", filters.search);
  }
  
  const queryString = queryParams.toString();
  const url = filters && Object.keys(filters).length > 0
    ? `/api/dealers/search?${queryString}`
    : '/api/dealers';
  
  return useQuery<Dealer[]>({
    queryKey: ["dealers", filters],
    queryFn: async () => {
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) {
        throw new Error("Failed to fetch dealers");
      }
      return response.json();
    },
  });
}

export function useDealer(id: string | number) {
  return useQuery<Dealer>({
    queryKey: ["dealer", id],
    queryFn: async () => {
      const response = await fetch(`/api/dealers/${id}`, { credentials: "include" });
      if (!response.ok) {
        throw new Error("Failed to fetch dealer");
      }
      return response.json();
    },
    enabled: !!id,
  });
}

export function useDealersByCategory(category: string, subcategory?: string) {
  return useQuery<Dealer[]>({
    queryKey: ["dealers", "category", category, subcategory],
    queryFn: async () => {
      const response = await fetch(`/api/dealers/category/${category}${subcategory ? `?subcategory=${subcategory}` : ''}`, { credentials: "include" });
      if (!response.ok) {
        throw new Error("Failed to fetch dealers by category");
      }
      return response.json();
    },
  });
}

export function useCreateDealer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Dealer>) => {
      const response = await fetch('/api/dealers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to create dealer");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dealers"] });
    },
  });
}

export function useUpdateDealer(id: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Dealer>) => {
      const response = await fetch(`/api/dealers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to update dealer");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dealers"] });
      queryClient.invalidateQueries({ queryKey: ["dealer", id] });
    },
  });
}
