import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCreator } from "../lib/api";

export function useCreateCreator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCreator,
    onSuccess: () => {
      // Invalidate ALL creators queries regardless of filters/page
      queryClient.invalidateQueries({ queryKey: ["creators"] });
    },
  });
}