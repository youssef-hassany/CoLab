import { baseUrl } from "@/constants/baseUrl";
import { User } from "@/types/User";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useGetLoggedInUser = () => {
  const router = useRouter();

  return useQuery({
    queryKey: ["logged-in-user"],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/api/users/me`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        router.replace("/");
        throw new Error(data.message || "Get User failed");
      }

      return data.data.user as User;
    },
  });
};
