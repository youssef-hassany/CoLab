import { baseUrl } from "@/constants/baseUrl";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateTaskCategory = async (
  teamId: string,
  categoryId: string,
  categoryName: string,
  categoryColor: string
) => {
  const response = await fetch(
    `${baseUrl}/api/teams/${teamId}/taskCategories/${categoryId}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categoryName, categoryColor }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to update task category: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const useUpdateTaskCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-task-category"],
    mutationFn: ({
      teamId,
      categoryId,
      categoryName,
      categoryColor,
    }: {
      teamId: string;
      categoryId: string;
      categoryName: string;
      categoryColor: string;
    }) => updateTaskCategory(teamId, categoryId, categoryName, categoryColor),
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["task-categories", variables.teamId],
      });
    },
  });
};
