import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCreator } from "../lib/api";

export function useDeleteCreator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCreator,

    // ─── Optimistic update ────────────────────────────────────────────────────
    // Before the DELETE request completes, remove the row from every cached
    // creators page so the UI feels instant.
    onMutate: async (deletedId) => {
      // Cancel any in-flight refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["creators"] });

      // Snapshot every creators cache entry so we can roll back on error
      const previousQueries = queryClient.getQueriesData({ queryKey: ["creators"] });

      // Optimistically remove the deleted creator from every cached page
      queryClient.setQueriesData({ queryKey: ["creators"] }, (old) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.filter((c) => c.id !== deletedId),
          total: old.total - 1,
        };
      });

      // Return snapshot so onError can roll back
      return { previousQueries };
    },

    // ─── Roll back on error ───────────────────────────────────────────────────
    onError: (_err, _deletedId, context) => {
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
