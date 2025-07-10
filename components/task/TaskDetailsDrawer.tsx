"use client";

import React, { useState } from "react";
import { useTaskDetailsStore } from "@/store/taskDetailsStore";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { useDeleteTask } from "@/hooks/server/tasks/useDeleteTask";
import TaskDetails from "./TaskDetails";
import { EditTaskForm } from "./EditTaskForm";

const TaskDetailsDrawer = ({ teamId }: { teamId: string }) => {
  const { selectedTask, isOpen, closeTaskDetails } = useTaskDetailsStore();
  const { mutateAsync: deleteTask, isPending: isDeleting } = useDeleteTask();
  const [isEditing, setIsEditing] = useState(false);

  if (!selectedTask) return null;

  const handleDeleteTask = async () => {
    await deleteTask({ teamId, taskId: selectedTask.id });
    closeTaskDetails();
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={closeTaskDetails}>
      <DrawerContent className="bg-zinc-900 border-zinc-700">
        <DrawerHeader className="border-b border-zinc-700">
          <DrawerTitle className="text-white text-xl font-semibold">
            {isEditing ? "Edit Task" : "Task Details"}
          </DrawerTitle>
          <DrawerDescription className="text-zinc-400">
            {isEditing
              ? "Update task information"
              : "View and manage task information"}
          </DrawerDescription>
        </DrawerHeader>

        {isEditing ? (
          <EditTaskForm
            task={selectedTask}
            teamId={teamId}
            onClose={handleCancelEdit}
            onSuccess={handleEditSuccess}
          />
        ) : (
          <TaskDetails task={selectedTask} />
        )}

        {!isEditing && (
          <DrawerFooter className="border-t border-zinc-700 bg-zinc-900">
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600"
                onClick={handleEditClick}
              >
                Edit Task
              </Button>
              <Button
                className="flex-1"
                variant="destructive"
                onClick={() => handleDeleteTask()}
              >
                {isDeleting ? "Deleting Task..." : "Delete Task"}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="flex-1">
                  Close
                </Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default TaskDetailsDrawer;
