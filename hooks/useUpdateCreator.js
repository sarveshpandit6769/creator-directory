import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCreator } from "../lib/api";

export function useUpdateCreator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCreator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creators"] });
    },
  });
}