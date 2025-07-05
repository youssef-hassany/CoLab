import { baseUrl } from "@/constants/baseUrl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (teamId: string) => {
      const response = await fetch(`${baseUrl}/api/teams/${teamId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete team");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch teams
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      // Redirect to home page
      router.push("/");
    },
  });
};
