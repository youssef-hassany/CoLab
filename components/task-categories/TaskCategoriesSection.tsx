"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Edit, Trash2, Tag } from "lucide-react";
import { TaskCategory } from "@/types/Task";
import { CreateCategoryModal } from "./CreateCategoryModal";
import { EditCategoryModal } from "./EditCategoryModal";
import { DeleteCategoryModal } from "./DeleteCategoryModal";
import { useGetTeamById } from "@/hooks/server/teams/useGetTeamById";
import { useSelectedTaskCategoryStore } from "@/store/selectedTaskCategoryStore";

interface TaskCategoriesSectionProps {
  taskCategories: TaskCategory[] | undefined;
  teamId: string;
  selectedTaskCategoryId: string | undefined;
}

export function TaskCategoriesSection({
  taskCategories,
  teamId,
  selectedTaskCategoryId,
}: TaskCategoriesSectionProps) {
  const { data: team } = useGetTeamById(teamId);
  const { setSelectedTaskCategoryId } = useSelectedTaskCategoryStore();

  const [showCategories, setShowCategories] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TaskCategory | null>(
    null
  );

  // Helper function to convert color names to hex values
  const getColorHex = (colorName: string) => {
    const colorMap: Record<string, string> = {
      blue: "#2563EB",
      green: "#16A34A",
      purple: "#9333EA",
      red: "#DC2626",
      orange: "#EA580C",
    };
    return colorMap[colorName] || "#2563EB";
  };

  const openEditModal = (category: TaskCategory) => {
    setEditingCategory(category);
    setShowEditModal(true);
  };

  const openDeleteModal = (category: TaskCategory) => {
    setEditingCategory(category);
    setShowDeleteModal(true);
  };

  const handleCategoryClick = (categoryId: string) => {
    if (selectedTaskCategoryId === categoryId) {
      setSelectedTaskCategoryId(undefined);
      return;
    }
    setSelectedTaskCategoryId(categoryId);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setShowCategories(!showCategories)}
          className="flex items-center gap-2 text-lg font-semibold hover:text-zinc-300 transition-colors"
        >
          <Tag className="w-5 h-5" />
          <span>Task Categories</span>
          {showCategories ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        <CreateCategoryModal teamId={teamId} />
      </div>
      {showCategories && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {taskCategories?.map((category) => (
            <div
              key={category.id}
              className={`flex items-center gap-3 p-2 rounded-lg bg-zinc-800 group cursor-pointer ${
                selectedTaskCategoryId === category.id
                  ? `border-2 border-${team?.theme}-500`
                  : ""
              }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getColorHex(category.categoryColor) }}
              />
              <span className="flex-1 text-sm text-white truncate">
                {category.categoryName}
              </span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-zinc-400 hover:text-white"
                  onClick={() => openEditModal(category)}
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-zinc-400 hover:text-red-400"
                  onClick={() => openDeleteModal(category)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
          {(!taskCategories || taskCategories.length === 0) && (
            <p className="text-sm text-zinc-400 text-center py-4">
              No categories yet. Create one to get started!
            </p>
          )}
        </div>
      )}

      <EditCategoryModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        category={editingCategory}
        teamId={teamId}
      />

      <DeleteCategoryModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        category={editingCategory}
        teamId={teamId}
      />
    </div>
  );
}
