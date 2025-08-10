import { baseUrl } from "@/constants/baseUrl";
import { useMutation } from "@tanstack/react-query";

const joinTeam = async (teamId: string) => {
  try {
    const url = `${baseUrl}/api/teams/joinTeam/${teamId}`;
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
    });
    const data = await response.json();
    return data.data.relation.teamId;
  } catch (error) {
    console.error(error);
  }
};

export const useJoinTeam = () => {
  return useMutation({
    mutationKey: ["join-team"],
    mutationFn: joinTeam,
  });
};
