import { baseUrl } from "@/constants/baseUrl";
import { TaskCategory } from "@/types/Task";
import { useQuery } from "@tanstack/react-query";

const getTaskCategories = async (teamId: string) => {
  try {
    const response = await fetch(
      `${baseUrl}/api/teams/${teamId}/taskCategories`,
      {
        credentials: "include",
      }
    );

    const data = await response.json();
    console.log(data);
    return data.data.taskCategory as TaskCategory[];
  } catch (error) {
    console.error(error);
  }
};

export const useGetTaskCategories = (teamId: string) => {
  return useQuery({
    queryKey: ["task-categories", teamId],
    queryFn: () => getTaskCategories(teamId),
  });
};
