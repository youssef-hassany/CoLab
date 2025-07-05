"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useCreateTaskCategory } from "@/hooks/server/task-categories/useCreateTaskCategory";
import { toast } from "sonner";

interface CreateCategoryModalProps {
  teamId: string;
}

export function CreateCategoryModal({ teamId }: CreateCategoryModalProps) {
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("blue");

  const { mutateAsync: createCategory, isPending } = useCreateTaskCategory();

  const handleCreateCategory = async () => {
    if (teamId && categoryName.trim()) {
      await createCategory(
        {
          teamId,
          categoryName: categoryName.trim(),
          categoryColor,
        },
        {
          onSuccess: () => {
            toast.success("Category created successfully");
            setOpen(false);
            setCategoryName("");
            setCategoryColor("blue");
          },
          onError: () => {
            toast.error("Failed to create category");
          },
        }
      );
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setCategoryName("");
      setCategoryColor("blue");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 w-8 p-0 bg-zinc-700 hover:bg-zinc-600">
          <Plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task Category</DialogTitle>
          <DialogDescription>
            Create a new category to organize your tasks.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="categoryName" className="mb-2">
              Category Name
            </Label>
            <Input
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
            />
          </div>
          <div>
            <Label htmlFor="categoryColor" className="mb-2">
              Color
            </Label>
            <Select value={categoryColor} onValueChange={setCategoryColor}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    Blue
                  </div>
                </SelectItem>
                <SelectItem value="green">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-600"></div>
                    Green
                  </div>
                </SelectItem>
                <SelectItem value="purple">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                    Purple
                  </div>
                </SelectItem>
                <SelectItem value="red">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-600"></div>
                    Red
                  </div>
                </SelectItem>
                <SelectItem value="orange">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                    Orange
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateCategory}
            disabled={!categoryName.trim() || isPending}
          >
            {isPending ? "Creating..." : "Create Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
