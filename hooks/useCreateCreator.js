import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCreator } from "../lib/api";

export function useCreateCreator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCreator,

    // ─── Optimistic update ────────────────────────────────────────────────────
    // Before the POST request completes, insert a temporary row at the top of
    // page 1 so the user sees the new entry immediately.
    // We use a temp id prefixed with "temp-" so we can identify and replace it.
    onMutate: async (newCreator) => {
      // Cancel any in-flight refetches
      await queryClient.cancelQueries({ queryKey: ["creators"] });

      // Snapshot all creators cache entries for rollback
      const previousQueries = queryClient.getQueriesData({ queryKey: ["creators"] });

      // Build the optimistic entry with a temporary id
      const optimisticCreator = {
        ...newCreator,
        id: `temp-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      // Insert at top of every cached page (user will see it on their current view)
      queryClient.setQueriesData({ queryKey: ["creators"] }, (old) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: [optimisticCreator, ...old.data],
          total: old.total + 1,
        };
      });

      return { previousQueries };
    },

    // ─── Roll back on error ───────────────────────────────────────────────────
    onError: (_err, _newCreator, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    // ─── Always refetch after settle to replace temp id with real id ──────────
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["creators"] });
    },
  });
}
