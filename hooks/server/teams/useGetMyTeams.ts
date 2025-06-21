import { baseUrl } from "@/constants/baseUrl";
import { Team } from "@/types/Team";
import { useQuery } from "@tanstack/react-query";

export const useGetMyTeams = () => {
  return useQuery({
    queryKey: ["my-teams"],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/api/teams`, {
        credentials: "include",
      });

      const data = await response.json();

      return data.data.user as Team[];
    },
  });
};
