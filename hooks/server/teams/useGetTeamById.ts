import { baseUrl } from "@/constants/baseUrl";
import { TeamDetails } from "@/types/Team";
import { useQuery } from "@tanstack/react-query";

export const useGetTeamById = (id: string) => {
  return useQuery({
    queryKey: ["team", id],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/api/teams/${id}`, {
        credentials: "include",
      });

      const data = await response.json();

      return data.data.teams as TeamDetails[];
    },
  });
};
