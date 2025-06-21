import { baseUrl } from "@/constants/baseUrl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useCreateTeam = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["teams"],
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`${baseUrl}/api/teams`, {
        method: "POST",
        body: formData,
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
