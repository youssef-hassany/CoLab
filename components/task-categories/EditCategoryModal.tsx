"use client";

import { useState, useEffect } from "react";
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
} from "@/components/ui/dialog";
import { useUpdateTaskCategory } from "@/hooks/server/task-categories/useUpdateTaskCategory";
import { TaskCategory } from "@/types/Task";
import { toast } from "sonner";

interface EditCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: TaskCategory | null;
  teamId: string;
}

export function EditCategoryModal({
  open,
  onOpenChange,
  category,
  teamId,
}: EditCategoryModalProps) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("blue");

  const { mutateAsync: updateCategory, isPending } = useUpdateTaskCategory();

  useEffect(() => {
    if (category) {
      setCategoryName(category.categoryName);
      setCategoryColor(category.categoryColor);
    }
  }, [category]);

  const handleUpdateCategory = async () => {
    if (teamId && category && categoryName.trim()) {
      await updateCategory(
        {
          teamId,
          categoryId: category.id,
          categoryName: categoryName.trim(),
          categoryColor,
        },
        {
          onSuccess: () => {
            toast.success("Category updated successfully");
            onOpenChange(false);
          },
          onError: () => {
            toast.error("Failed to update category");
          },
        }
      );
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      setCategoryName("");
      setCategoryColor("blue");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task Category</DialogTitle>
          <DialogDescription>
            Update the category name and color.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="editCategoryName">Category Name</Label>
            <Input
              id="editCategoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
            />
          </div>
          <div>
            <Label htmlFor="editCategoryColor">Color</Label>
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
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateCategory}
            disabled={!categoryName.trim() || isPending}
          >
            {isPending ? "Updating..." : "Update Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
