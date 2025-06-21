import { Calendar } from "lucide-react";
import React from "react";

const UpcomingDeadlines = () => {
  const upcomingDeadlines = [
    {
      id: 1,
      task: "API Integration Testing",
      team: "Frontend Development",
      dueDate: "Tomorrow",
      priority: "high",
    },
    {
      id: 2,
      task: "Brand Guidelines Review",
      team: "Marketing Campaign",
      dueDate: "In 3 days",
      priority: "medium",
    },
    {
      id: 3,
      task: "User Flow Documentation",
      team: "Product Design",
      dueDate: "Next week",
      priority: "low",
    },
  ];

  return (
    <section>
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-emerald-400" />
        Upcoming Deadlines
      </h3>
      <div className="space-y-3">
        {upcomingDeadlines.map((deadline) => (
          <div
            key={deadline.id}
            className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 hover:border-emerald-500/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-white text-sm">
                {deadline.task}
              </h4>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  deadline.priority === "high"
                    ? "bg-red-500/20 text-red-400"
                    : deadline.priority === "medium"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-green-500/20 text-green-400"
                }`}
              >
                {deadline.priority}
              </span>
            </div>
            <p className="text-zinc-400 text-xs mb-1">{deadline.team}</p>
            <p className="text-emerald-400 text-sm font-medium">
              {deadline.dueDate}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UpcomingDeadlines;
