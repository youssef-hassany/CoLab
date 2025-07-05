import { baseUrl } from "@/constants/baseUrl";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const changeStatus = async (taskId: string, teamId: string, status: string) => {
  const response = await fetch(
    `${baseUrl}/api/teams/${teamId}/tasks/${taskId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskStatus: status.toUpperCase() }),
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to change task status: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
};

export const useChangeTaskStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["changeTaskStatus"],
    mutationFn: ({
      taskId,
      teamId,
      status,
    }: {
      taskId: string;
      teamId: string;
      status: string;
    }) => changeStatus(taskId, teamId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.teamId] });
    },
  });
};
