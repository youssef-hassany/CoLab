import React from "react";
import { Users, Calendar, Plus } from "lucide-react";

const TeamPageSkeleton: React.FC = () => {
  return (
    <main className="w-full min-h-screen bg-zinc-800 text-white flex">
      {/* Sidebar Skeleton */}
      <div className="w-80 bg-zinc-900 border-r border-zinc-700 p-6">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {/* Team Logo Skeleton */}
            <div className="w-12 h-12 bg-zinc-700 rounded-lg animate-pulse"></div>
            <div>
              <div className="h-6 bg-zinc-700 rounded w-32 mb-2 animate-pulse"></div>
              <div className="h-4 bg-zinc-700 rounded w-24 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Team Overview Skeleton */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Team Overview</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-zinc-400" />
              <div className="h-4 bg-zinc-700 rounded w-20 animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-zinc-400" />
              <div className="h-4 bg-zinc-700 rounded w-24 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Team Members Skeleton */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Team Members</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg bg-zinc-800"
              >
                <div className="w-8 h-8 bg-zinc-600 rounded-full animate-pulse"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-zinc-700 rounded w-20 mb-1 animate-pulse"></div>
                  <div className="h-3 bg-zinc-700 rounded w-32 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Summary Skeleton */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Task Summary</h2>
          <div className="grid grid-cols-2 gap-2">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-zinc-800 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-zinc-600 animate-pulse"></div>
                  <div className="h-3 bg-zinc-700 rounded w-16 animate-pulse"></div>
                </div>
                <div className="h-6 bg-zinc-700 rounded w-8 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Skeleton - Kanban Board */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <div className="h-8 bg-zinc-700 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-zinc-700 rounded w-64 animate-pulse"></div>
        </div>

        <div className="flex gap-6">
          {[...Array(4)].map((_, columnIndex) => (
            <div
              key={columnIndex}
              className="flex-1 bg-zinc-900 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-zinc-600 animate-pulse"></div>
                  <div className="h-5 bg-zinc-700 rounded w-20 animate-pulse"></div>
                  <div className="bg-zinc-700 px-2 py-1 rounded-full h-5 w-6 animate-pulse"></div>
                </div>
                <Plus className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="min-h-[500px] space-y-2">
                {[...Array(Math.floor(Math.random() * 3) + 1)].map(
                  (_, taskIndex) => (
                    <div
                      key={taskIndex}
                      className="bg-zinc-700 rounded-lg p-4 mb-3 border-l-4 border-l-zinc-600"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="h-4 bg-zinc-600 rounded w-32 animate-pulse"></div>
                        <div className="w-4 h-4 bg-zinc-600 rounded animate-pulse"></div>
                      </div>
                      <div className="h-3 bg-zinc-600 rounded w-full mb-1 animate-pulse"></div>
                      <div className="h-3 bg-zinc-600 rounded w-3/4 mb-3 animate-pulse"></div>
                      <div className="flex items-center justify-between">
                        <div className="h-3 bg-zinc-600 rounded w-16 animate-pulse"></div>
                        <div className="h-5 bg-zinc-600 rounded w-12 animate-pulse"></div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default TeamPageSkeleton;
