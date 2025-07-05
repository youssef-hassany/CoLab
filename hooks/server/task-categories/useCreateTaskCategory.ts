import { baseUrl } from "@/constants/baseUrl";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createTaskCategory = async (
  teamId: string,
  categoryName: string,
  categoryColor: string
) => {
  const response = await fetch(
    `${baseUrl}/api/teams/${teamId}/taskCategories`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categoryName, categoryColor }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to create task category: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const useCreateTaskCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-task-category"],
    mutationFn: ({
      teamId,
      categoryName,
      categoryColor,
    }: {
      teamId: string;
      categoryName: string;
      categoryColor: string;
    }) => createTaskCategory(teamId, categoryName, categoryColor),
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["task-categories", variables.teamId],
      });
    },
  });
};
