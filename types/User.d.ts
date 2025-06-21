export interface User {
  id: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
  isdeleted: boolean;
  createdAt: string;
  updatedAt: string;
  photo?: string;
}
