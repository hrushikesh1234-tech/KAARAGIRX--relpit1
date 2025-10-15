import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface RentalEquipment {
  id: number;
  merchantId: number;
  name: string;
  category: string;
  subcategory?: string;
  description?: string;
  hourlyRate?: string | number;
  dailyRate: string | number;
  weeklyRate?: string | number;
  monthlyRate?: string | number;
  securityDeposit?: string | number;
  quantity?: number;
  available?: number;
  availability?: string;
  image?: string;
  images?: string[];
  specifications?: Record<string, string>;
  condition?: string;
  minRentalPeriod?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  // Merchant info from API join
  merchantName?: string;
  merchantLocation?: string;
  merchantRating?: string | number;
  merchantReviewCount?: number;
  // Formatted fields from API
  supplier?: string;
  location?: string;
  price?: string;
  period?: string;
  rating?: number;
  reviews?: number;
  features?: string[];
}

interface RentalEquipmentFilters {
  merchantId?: number;
  category?: string;
  subcategory?: string;
  search?: string;
  available?: boolean;
}

export function useRentalEquipment(filters?: RentalEquipmentFilters) {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    if (filters.merchantId) queryParams.append("merchantId", filters.merchantId.toString());
    if (filters.category) queryParams.append("category", filters.category);
    if (filters.subcategory) queryParams.append("subcategory", filters.subcategory);
    if (filters.search) queryParams.append("search", filters.search);
    if (filters.available !== undefined) queryParams.append("available", filters.available.toString());
  }
  
  const queryString = queryParams.toString();
  const url = filters && Object.keys(filters).length > 0
    ? `/api/rental-equipment/search?${queryString}`
    : '/api/rental-equipment';
  
  return useQuery<RentalEquipment[]>({
    queryKey: ["rental-equipment", filters],
    queryFn: async () => {
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) {
        throw new Error("Failed to fetch rental equipment");
      }
      return response.json();
    },
  });
}

export function useRentalEquipmentItem(id: string | number) {
  return useQuery<RentalEquipment>({
    queryKey: ["rental-equipment", id],
    queryFn: async () => {
      const response = await fetch(`/api/rental-equipment/${id}`, { credentials: "include" });
      if (!response.ok) {
        throw new Error("Failed to fetch rental equipment item");
      }
      return response.json();
    },
    enabled: !!id,
  });
}

export function useRentalEquipmentByMerchant(merchantId: number) {
  return useQuery<RentalEquipment[]>({
    queryKey: ["rental-equipment", "merchant", merchantId],
    queryFn: async () => {
      const response = await fetch(`/api/rental-equipment/merchant/${merchantId}`, { credentials: "include" });
      if (!response.ok) {
        throw new Error("Failed to fetch rental equipment by merchant");
      }
      return response.json();
    },
    enabled: !!merchantId,
  });
}

export function useCreateRentalEquipment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<RentalEquipment>) => {
      const response = await fetch('/api/rental-equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to create rental equipment");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rental-equipment"] });
    },
  });
}

export function useUpdateRentalEquipment(id: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<RentalEquipment>) => {
      const response = await fetch(`/api/rental-equipment/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to update rental equipment");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rental-equipment"] });
      queryClient.invalidateQueries({ queryKey: ["rental-equipment", id] });
    },
  });
}

export function useDeleteRentalEquipment(id: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/rental-equipment/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error("Failed to delete rental equipment");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rental-equipment"] });
    },
  });
}
