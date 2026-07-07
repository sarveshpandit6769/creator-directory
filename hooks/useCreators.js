import { useQuery } from "@tanstack/react-query";
import { fetchCreators } from "../lib/api";

export function useCreators(filters) {
  return useQuery({
    // Every filter param is part of the cache key.
    // Changing any filter = new cache entry = automatic refetch.
    queryKey: ["creators", filters],
    queryFn: () => fetchCreators(filters),
    placeholderData: (previousData) => previousData, // keeps old data while fetching new page
    staleTime: 30 * 1000, // 30 seconds
  });
}