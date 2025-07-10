import { baseUrl } from "@/constants/baseUrl";
import { Task } from "@/types/Task";
import { useQuery } from "@tanstack/react-query";

const getTasks = async (teamId: string, taskCategoryId?: string) => {
  let url = `${baseUrl}/api/teams/${teamId}/tasks`;
  if (taskCategoryId) {
    url += `?taskCategoryId=${encodeURIComponent(taskCategoryId)}`;
  }
  const response = await fetch(url, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }

  const data = await response.json();

  // Debug logging to see the actual response structure
  console.log("API Response:", data);

  // Handle the nested structure: data.data.tasks.{STATUS}
  if (data.data?.tasks && typeof data.data.tasks === "object") {
    console.log("Using nested tasks structure");
    const allTasks: Task[] = [];

    // Flatten the nested structure into a single array
    Object.entries(data.data.tasks).forEach(([status, tasks]) => {
      if (Array.isArray(tasks)) {
        tasks.forEach((task: any) => {
          // Transform backend task format to frontend format
          allTasks.push({
            id: task.id,
            title: task.taskName,
            description: task.taskDescription,
            assignee: task.assignedBy?.user || "Unassigned",
            priority: task.taskPriority,
            status: task.taskStatus,
            deadline: task.taskDeadline,
            assignedToId: task.assignedToId,
            categoryId: task.taskCategoryId,
          });
        });
      }
    });

    console.log("Flattened tasks:", allTasks);
    return allTasks;
  } else if (data.data?.tasks && Array.isArray(data.data.tasks)) {
    console.log("Using data.data.tasks array");
    return data.data.tasks as Task[];
  } else if (data.tasks && Array.isArray(data.tasks)) {
    console.log("Using data.tasks array");
    return data.tasks as Task[];
  } else if (Array.isArray(data)) {
    console.log("Using data directly");
    return data as Task[];
  } else {
    console.log("No valid tasks found, returning empty array");
    return [] as Task[];
  }
};

export const useGetTasks = (teamId: string, taskCategoryId?: string) => {
  return useQuery({
    queryKey: ["tasks", teamId, taskCategoryId],
    queryFn: () => getTasks(teamId, taskCategoryId),
    enabled: !!teamId,
    initialData: [] as Task[],
  });
};
