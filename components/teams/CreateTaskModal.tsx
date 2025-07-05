"use client";

import { useCreateTask } from "@/hooks/server/tasks/useCreateTask";
import { TaskPriority, TaskStatus } from "@/types/Task";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { useGetTeamById } from "@/hooks/server/teams/useGetTeamById";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  defaultStatus?: TaskStatus;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  teamId,
  defaultStatus = "ISSUED",
}) => {
  const { data: team } = useGetTeamById(teamId);

  const createTaskMutation = useCreateTask();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    taskName: "",
    taskDescription: "",
    taskDeadline: "",
    taskPriority: "MEDIUM" as TaskPriority,
    taskStatus: defaultStatus,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.taskName.trim() ||
      !formData.taskDescription.trim() ||
      !formData.taskDeadline
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Create FormData
      const formDataToSend = new FormData();
      formDataToSend.append("teamId", teamId);
      formDataToSend.append("taskName", formData.taskName);
      formDataToSend.append("taskDescription", formData.taskDescription);
      formDataToSend.append("taskDeadline", formData.taskDeadline);
      formDataToSend.append("taskStatus", formData.taskStatus);
      formDataToSend.append("taskPriority", formData.taskPriority);

      // Add file if selected
      if (selectedFile) {
        formDataToSend.append("attachedFile", selectedFile);
      }

      const taskData: any = {
        teamId,
        taskName: formData.taskName,
        taskDescription: formData.taskDescription,
        taskDeadline: formData.taskDeadline,
        taskStatus: formData.taskStatus,
        taskPriority: formData.taskPriority,
      };

      if (selectedFile) {
        taskData.attachedFile = selectedFile;
      }

      await createTaskMutation.mutateAsync(taskData);

      toast.success("Task created successfully!");
      onClose();
      setFormData({
        taskName: "",
        taskDescription: "",
        taskDeadline: "",
        taskPriority: "MEDIUM",
        taskStatus: defaultStatus,
      });
      setSelectedFile(null);
    } catch (error) {
      toast.error("Failed to create task. Please try again.");
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Task</DialogTitle>
        </DialogHeader>
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
              Deadline *
            </Label>
            <Input
              id="taskDeadline"
              type="datetime-local"
              value={formData.taskDeadline}
              onChange={(e) =>
                setFormData({ ...formData, taskDeadline: e.target.value })
              }
              className="bg-zinc-800 border-zinc-600 text-white"
            />
          </div>

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
              disabled={createTaskMutation.isPending}
              className={`flex-1 bg-${team?.theme}-600 hover:bg-${team?.theme}-700 text-white`}
            >
              {createTaskMutation.isPending ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
