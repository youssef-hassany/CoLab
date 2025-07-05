import { baseUrl } from "@/constants/baseUrl";
import { useQuery } from "@tanstack/react-query";

interface UsersList {
  id: string;
  username: string;
  email: string;
  photo: string;
}

const getUsersByUsername = async (username: string) => {
  const response = await fetch(
    `${baseUrl}/api/users/mention?username=${username}`,
    {
      credentials: "include",
    }
  );
  const data = await response.json();
  return data.data as UsersList[];
};

export const useGetUsersByUsername = (username: string) => {
  return useQuery({
    queryKey: ["users", username],
    queryFn: () => getUsersByUsername(username),
    enabled: username.length >= 2,
  });
};
