import { baseUrl } from "@/constants/baseUrl";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useSignup = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ["user"],
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`${baseUrl}/api/signup`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "signup failed");
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
