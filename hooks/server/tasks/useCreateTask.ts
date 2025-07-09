import { baseUrl } from "@/constants/baseUrl";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Task {
  teamId: string;
  taskName: string;
  taskDescription: string;
  taskDeadline: string;
  taskStatus?: string;
  taskPriority?: string;
  taskCategoryId?: string;
  assignedToId?: string;
  attachedFile?: File | string;
}

export type { Task };

const createTask = async ({
  teamId,
  taskName,
  taskDescription,
  taskDeadline,
  taskStatus,
  taskPriority,
  attachedFile,
  taskCategoryId,
  assignedToId,
}: Task) => {
  // Create FormData
  const formData = new FormData();
  formData.append("teamId", teamId);
  formData.append("taskName", taskName);
  formData.append("taskDescription", taskDescription);
  formData.append("taskDeadline", taskDeadline);
  formData.append("taskStatus", taskStatus?.toUpperCase() || "ISSUED");
  formData.append("taskPriority", taskPriority?.toUpperCase() || "MEDIUM");
  formData.append("taskCategoryId", taskCategoryId || "");
  formData.append("assignedToId", assignedToId || "");

  // Add file if provided
  if (attachedFile instanceof File) {
    formData.append("attachedFile", attachedFile);
  }

  const response = await fetch(`${baseUrl}/api/teams/${teamId}/tasks`, {
    method: "POST",
    body: formData, // Use FormData instead of JSON
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to create task: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createTask"],
    mutationFn: createTask,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.teamId] });
    },
  });
};
