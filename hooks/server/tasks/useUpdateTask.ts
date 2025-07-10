import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { baseUrl } from "@/constants/baseUrl";

interface UpdateTaskData {
  teamId: string;
  taskId: string;
  taskName?: string;
  taskDescription?: string;
  taskDeadline?: string;
  taskStatus?: string;
  taskPriority?: string;
  taskCategoryId?: string;
  assignedToId?: string;
  attachedFile?: File;
}

const updateTask = async (data: UpdateTaskData) => {
  try {
    // Create FormData for the update
    const formData = new FormData();
    formData.append("teamId", data.teamId);

    if (data.taskName) formData.append("taskName", data.taskName);
    if (data.taskDescription)
      formData.append("taskDescription", data.taskDescription);
    if (data.taskDeadline) formData.append("taskDeadline", data.taskDeadline);
    if (data.taskStatus) formData.append("taskStatus", data.taskStatus);
    if (data.taskPriority) formData.append("taskPriority", data.taskPriority);
    if (data.taskCategoryId)
      formData.append("taskCategoryId", data.taskCategoryId);
    if (data.assignedToId) formData.append("assignedToId", data.assignedToId);

    // Add file if provided
    if (data.attachedFile instanceof File) {
      formData.append("attachedFile", data.attachedFile);
    }

    const response = await fetch(
      `${baseUrl}/api/teams/${data.teamId}/tasks/${data.taskId}`,
      {
        method: "PATCH",
        body: formData,
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update task: ${response.statusText}`);
    }

    toast.success("Task updated successfully");
  } catch (error) {
    toast.error("Failed to update task");
    console.error(error);
  }
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTask,
    onSuccess: (_, variables) => {
      // Invalidate all task queries for this team to ensure UI updates
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.teamId] });
    },
  });
};
