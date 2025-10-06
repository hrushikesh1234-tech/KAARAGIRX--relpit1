import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Bookmark } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export function useBookmarks() {
  return useQuery<Bookmark[]>({
    queryKey: ["/api/bookmarks"],
    queryFn: async () => {
      const response = await fetch('/api/bookmarks');
      if (!response.ok) {
        throw new Error('Failed to fetch bookmarks');
      }
      return response.json();
    },
  });
}

export function useCreateBookmark() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (professionalId: number) => 
      apiRequest("POST", "/api/bookmarks", { professionalId }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      toast({
        title: "Success",
        description: "Professional added to bookmarks",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to bookmark professional",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteBookmark() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (bookmarkId: number) => 
      apiRequest("DELETE", `/api/bookmarks/${bookmarkId}`, undefined).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      toast({
        title: "Success",
        description: "Professional removed from bookmarks",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove bookmark",
        variant: "destructive",
      });
    },
  });
}
