import { Calendar } from "lucide-react";
import React from "react";

const RecentActivity = () => {
  const recentActivity = [
    {
      id: 1,
      action: "Task completed",
      task: "Update user authentication",
      team: "Frontend Development",
      time: "2 hours ago",
    },
    {
      id: 2,
      action: "New task assigned",
      task: "Create landing page mockup",
      team: "Product Design",
      time: "4 hours ago",
    },
    {
      id: 3,
      action: "Deadline approaching",
      task: "Social media strategy",
      team: "Marketing Campaign",
      time: "1 day ago",
    },
  ];

  return (
    <section>
      <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
        <Calendar className="w-6 h-6 text-emerald-400" />
        Recent Activity
      </h2>

      <div className="bg-zinc-800 rounded-xl border border-zinc-700 divide-y divide-zinc-700">
        {recentActivity.map((activity) => (
          <div
            key={activity.id}
            className="p-4 hover:bg-zinc-750 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{activity.action}</p>
                <p className="text-emerald-400 text-sm">{activity.task}</p>
                <p className="text-zinc-400 text-xs">{activity.team}</p>
              </div>
              <span className="text-zinc-500 text-sm">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentActivity;
