import { CheckCircle, Users } from "lucide-react";
import React from "react";

const UserTeamsList = () => {
  const userTeams = [
    {
      id: 1,
      name: "Frontend Development",
      members: 8,
      activeTasks: 12,
      color: "bg-emerald-500",
      role: "Admin",
    },
    {
      id: 2,
      name: "Marketing Campaign",
      members: 5,
      activeTasks: 7,
      color: "bg-blue-500",
      role: "Member",
    },
    {
      id: 3,
      name: "Product Design",
      members: 6,
      activeTasks: 9,
      color: "bg-purple-500",
      role: "Member",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {userTeams.map((team) => (
        <div
          key={team.id}
          className="bg-zinc-800 hover:bg-zinc-750 rounded-xl p-6 border border-zinc-700 hover:border-emerald-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${team.color}`}></div>
              <h3 className="font-semibold text-lg group-hover:text-emerald-400 transition-colors">
                {team.name}
              </h3>
            </div>
            <span className="text-xs px-2 py-1 bg-zinc-700 text-zinc-300 rounded-full">
              {team.role}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm text-zinc-400">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {team.members} members
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              {team.activeTasks} active tasks
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserTeamsList;
