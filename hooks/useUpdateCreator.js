import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCreator } from "../lib/api";

export function useUpdateCreator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCreator,

    // ─── Optimistic update ────────────────────────────────────────────────────
    // Before the PATCH request completes, update the row in every cached page
    // so the UI reflects the change instantly.
    onMutate: async (updatedCreator) => {
      // Cancel any in-flight refetches
      await queryClient.cancelQueries({ queryKey: ["creators"] });

      // Snapshot all creators cache entries for rollback
      const previousQueries = queryClient.getQueriesData({ queryKey: ["creators"] });

      // Optimistically update the matching row in every cached page
      queryClient.setQueriesData({ queryKey: ["creators"] }, (old) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.map((c) =>
            c.id === updatedCreator.id ? { ...c, ...updatedCreator } : c
          ),
        };
      });

      return { previousQueries };
    },

    // ─── Roll back on error ───────────────────────────────────────────────────
    onError: (_err, _updatedCreator, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    // ─── Always refetch after settle ─────────────────────────────────────────
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["creators"] });
    },
  });
}
