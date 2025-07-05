import { baseUrl } from "@/constants/baseUrl";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteTaskCategory = async (teamId: string, categoryId: string) => {
  try {
    const response = await fetch(
      `${baseUrl}/api/teams/${teamId}/taskCategories/${categoryId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
  } catch (error) {}
};

export const useDeleteTaskCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-category"],
    mutationFn: ({
      teamId,
      categoryId,
    }: {
      teamId: string;
      categoryId: string;
    }) => deleteTaskCategory(teamId, categoryId),
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["task-categories", variables.teamId],
      });
    },
  });
};
