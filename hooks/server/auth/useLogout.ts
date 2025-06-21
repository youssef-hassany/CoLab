import { baseUrl } from "@/constants/baseUrl";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ["user"],
    mutationFn: async () => {
      const response = await fetch(`${baseUrl}/api/logout`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Logout failed");
      }
    },
    onSuccess: () => {
      router.replace("/");
    },
    onError: (error: Error) => {
      console.error(error);
    },
  });
};
