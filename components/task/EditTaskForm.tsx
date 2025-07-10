"use client";

import { useUpdateTask } from "@/hooks/server/tasks/useUpdateTask";
import { TaskPriority, TaskStatus, Task } from "@/types/Task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { useGetTeamById } from "@/hooks/server/teams/useGetTeamById";
import { useGetTaskCategories } from "@/hooks/server/task-categories/useGetTaskCategories";
import React from "react";

interface EditTaskFormProps {
  task: Task;
  teamId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditTaskForm: React.FC<EditTaskFormProps> = ({
  task,
  teamId,
  onClose,
  onSuccess,
}) => {
  const { data: team } = useGetTeamById(teamId);
  const { data: taskCategories } = useGetTaskCategories(teamId);

  const updateTaskMutation = useUpdateTask();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    taskName: task.title,
    taskDescription: task.description,
    taskDeadline: task.deadline ? new Date(task.deadline) : undefined,
    taskPriority: task.priority,
    taskStatus: task.status,
    taskCategory: task.categoryId || "",
    assignToUser: task.assignedToId || "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Set default values when data is loaded and no current values
  React.useEffect(() => {
    if (taskCategories && taskCategories.length > 0 && !formData.taskCategory) {
      setFormData((prev) => ({ ...prev, taskCategory: taskCategories[0].id }));
    }
  }, [taskCategories, formData.taskCategory]);

  React.useEffect(() => {
    if (team && team.teamMembers.length > 0 && !formData.assignToUser) {
      setFormData((prev) => ({
        ...prev,
        assignToUser: team.teamMembers[0].relationId,
      }));
    }
  }, [team, formData.assignToUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.taskName.trim() || !formData.taskDescription.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const updateData: any = {
        teamId,
        taskId: task.id,
        taskName: formData.taskName,
        taskDescription: formData.taskDescription,
        taskStatus: formData.taskStatus,
        taskPriority: formData.taskPriority,
      };

      if (formData.taskDeadline) {
        updateData.taskDeadline = formData.taskDeadline.toISOString();
      }
      if (formData.taskCategory) {
        updateData.taskCategoryId = formData.taskCategory;
      }
      if (formData.assignToUser) {
        updateData.assignedToId = formData.assignToUser;
      }
      if (selectedFile) {
        updateData.attachedFile = selectedFile;
      }

      await updateTaskMutation.mutateAsync(updateData);
      toast.success("Task updated successfully!");
      onSuccess();
    } catch (error) {
      toast.error("Failed to update task. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="taskName" className="text-zinc-300">
            Task Name *
          </Label>
          <Input
            id="taskName"
            value={formData.taskName}
            onChange={(e) =>
              setFormData({ ...formData, taskName: e.target.value })
            }
            className="bg-zinc-800 border-zinc-600 text-white"
            placeholder="Enter task name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="taskDescription" className="text-zinc-300">
            Description *
          </Label>
          <Textarea
            id="taskDescription"
            value={formData.taskDescription}
            onChange={(e) =>
              setFormData({ ...formData, taskDescription: e.target.value })
            }
            className="bg-zinc-800 border-zinc-600 text-white"
            placeholder="Enter task description"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="taskDeadline" className="text-zinc-300">
            Deadline
          </Label>
          <DatePicker
            date={formData.taskDeadline}
            onDateChange={(date) =>
              setFormData({ ...formData, taskDeadline: date })
            }
            placeholder="Select deadline"
          />
        </div>

        {taskCategories && (
          <div className="space-y-2">
            <Label htmlFor="taskCategory" className="text-zinc-300">
              Task Category
            </Label>
            <Select
              value={formData.taskCategory || ""}
              onValueChange={(value: string) =>
                setFormData({ ...formData, taskCategory: value })
              }
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-600 text-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-600">
                {taskCategories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="taskPriority" className="text-zinc-300">
            Priority
          </Label>
          <Select
            value={formData.taskPriority}
            onValueChange={(value: TaskPriority) =>
              setFormData({ ...formData, taskPriority: value })
            }
          >
            <SelectTrigger className="bg-zinc-800 border-zinc-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-600">
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="taskStatus" className="text-zinc-300">
            Status
          </Label>
          <Select
            value={formData.taskStatus}
            onValueChange={(value: TaskStatus) =>
              setFormData({ ...formData, taskStatus: value })
            }
          >
            <SelectTrigger className="bg-zinc-800 border-zinc-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-600">
              <SelectItem value="ISSUED">Issued</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="IN_REVIEW">In Review</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignToUser" className="text-zinc-300">
            Assign To
          </Label>
          <Select
            value={formData.assignToUser || ""}
            onValueChange={(value: string) =>
              setFormData({ ...formData, assignToUser: value })
            }
          >
            <SelectTrigger className="bg-zinc-800 border-zinc-600 text-white">
              <SelectValue placeholder="Select a team member" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-600">
              {team?.teamMembers.map((member) => (
                <SelectItem key={member.relationId} value={member.relationId}>
                  {member.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* File Attachment Section */}
        <div className="space-y-2">
          <Label className="text-zinc-300">Attachment (Optional)</Label>
          <div className="space-y-2">
            {!selectedFile ? (
              <div className="border-2 border-dashed border-zinc-600 rounded-lg p-4 text-center hover:border-zinc-500 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center gap-2 text-zinc-400 hover:text-zinc-300 transition-colors"
                >
                  <Upload className="w-6 h-6" />
                  <span className="text-sm">Click to upload a file</span>
                  <span className="text-xs">
                    PDF, DOC, TXT, Images (max 10MB)
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg border border-zinc-600">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm text-white truncate">
                    {selectedFile.name}
                  </span>
                  <span className="text-xs text-zinc-400">
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-1 text-zinc-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-transparent border-zinc-600 text-zinc-300 hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={updateTaskMutation.isPending}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {updateTaskMutation.isPending ? "Updating..." : "Update Task"}
          </Button>
        </div>
      </form>
    </div>
  );
};
