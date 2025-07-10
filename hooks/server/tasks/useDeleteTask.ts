import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { baseUrl } from "@/constants/baseUrl";

const deleteTask = async ({
  teamId,
  taskId,
}: {
  teamId: string;
  taskId: string;
}) => {
  try {
    await fetch(`${baseUrl}/api/teams/${teamId}/tasks/${taskId}`, {
      method: "DELETE",
      credentials: "include",
    });

    toast.success("Task deleted successfully");
  } catch (error) {
    toast.error("Failed to delete task");
    console.error(error);
  }
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_, variables) => {
      // Invalidate all task queries for this team to ensure UI updates
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.teamId] });
    },
  });
};
