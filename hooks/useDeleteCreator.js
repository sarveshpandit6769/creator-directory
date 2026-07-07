import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCreator } from "../lib/api";

export function useDeleteCreator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCreator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creators"] });
    },
  });
}