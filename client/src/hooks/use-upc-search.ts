import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

interface SearchRequest {
  query: string;
}

interface SearchResponse {
  products: Product[];
}

export function useUpcSearch() {
  const queryClient = useQueryClient();

  return useMutation<SearchResponse, Error, SearchRequest>({
    mutationFn: async ({ query }) => {
      const response = await apiRequest("POST", "/api/search", { query });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate search history to refresh it
      queryClient.invalidateQueries({ queryKey: ["/api/history"] });
    },
  });
}
