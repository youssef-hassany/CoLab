import { baseUrl } from "@/constants/baseUrl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface Payload {
  teamData: {
    teamName: string;
    teamLogo: string;
    theme: string;
  };
  members: string[];
}

export const useCreateTeam = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["teams"],
    mutationFn: async (payload: Payload) => {
      const response = await fetch(`${baseUrl}/api/teams`, {
        method: "POST",
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "failed to create team");
      } else {
        router.push(`/teams/${data.data.id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-teams"] });
    },
    onError: (error: Error) => {
      console.error(error);
    },
  });
};
