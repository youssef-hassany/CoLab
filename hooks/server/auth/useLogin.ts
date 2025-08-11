import { baseUrl } from "@/constants/baseUrl";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ["user"],
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`${baseUrl}/api/login`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
    },
    onSuccess: () => {
      router.replace("/home");
    },
    onError: (error: Error) => {
      console.error(error);
    },
  });
};
