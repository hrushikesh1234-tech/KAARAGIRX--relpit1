import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Material {
  id: number;
  dealerId: number;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  unit: string;
  description?: string;
  inStock: boolean;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MaterialFilters {
  dealerId?: number;
  category?: string;
  subcategory?: string;
  search?: string;
  inStock?: boolean;
}

export function useMaterials(filters?: MaterialFilters) {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    if (filters.dealerId) queryParams.append("dealerId", filters.dealerId.toString());
    if (filters.category) queryParams.append("category", filters.category);
    if (filters.subcategory) queryParams.append("subcategory", filters.subcategory);
    if (filters.search) queryParams.append("search", filters.search);
    if (filters.inStock !== undefined) queryParams.append("inStock", filters.inStock.toString());
  }
  
  const queryString = queryParams.toString();
  const url = filters && Object.keys(filters).length > 0
    ? `/api/materials/search?${queryString}`
    : '/api/materials';
  
  return useQuery<Material[]>({
    queryKey: ["materials", filters],
    queryFn: async () => {
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) {
        throw new Error("Failed to fetch materials");
      }
      return response.json();
    },
  });
}

export function useMaterial(id: string | number) {
  return useQuery<Material>({
    queryKey: ["material", id],
    queryFn: async () => {
      const response = await fetch(`/api/materials/${id}`, { credentials: "include" });
      if (!response.ok) {
        throw new Error("Failed to fetch material");
      }
      return response.json();
    },
    enabled: !!id,
  });
}

export function useMaterialsByDealer(dealerId: number) {
  return useQuery<Material[]>({
    queryKey: ["materials", "dealer", dealerId],
    queryFn: async () => {
      const response = await fetch(`/api/materials/dealer/${dealerId}`, { credentials: "include" });
      if (!response.ok) {
        throw new Error("Failed to fetch materials by dealer");
      }
      return response.json();
    },
    enabled: !!dealerId,
  });
}

export function useCreateMaterial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Material>) => {
      const response = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to create material");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
  });
}

export function useUpdateMaterial(id: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Material>) => {
      const response = await fetch(`/api/materials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to update material");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      queryClient.invalidateQueries({ queryKey: ["material", id] });
    },
  });
}

export function useDeleteMaterial(id: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/materials/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error("Failed to delete material");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
  });
}
