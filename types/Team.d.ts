export interface Team {
  id: string;
  teamName: string;
  teamLogo: string;
  theme: string;
  joinCode: string;
  userRole: "LEADER" | "MEMBER";
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamDetails {
  teamName: string;
  teamLogo: string;
  theme: string;
  teamMembers: TeamMember[];
}

interface TeamMember {
  id: string;
  username: string;
  email: string;
  photo: string;
  teamRole: "OWNER" | "MEMBER";
  joinAt: Date;
  relationId: string;
  isMe: true;
}
