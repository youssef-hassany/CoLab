import React from "react";

const StatsSection = () => {
  // Static data for demonstration
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
    <section>
      <h3 className="text-xl font-semibold text-white mb-4">Quick Overview</h3>
      <div className="space-y-4">
        <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Teams Joined</span>
            <span className="text-2xl font-bold text-emerald-400">
              {userTeams.length}
            </span>
          </div>
        </div>

        <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Active Tasks</span>
            <span className="text-2xl font-bold text-blue-400">
              {userTeams.reduce((sum, team) => sum + team.activeTasks, 0)}
            </span>
          </div>
        </div>

        <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Team Members</span>
            <span className="text-2xl font-bold text-purple-400">
              {userTeams.reduce((sum, team) => sum + team.members, 0)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
