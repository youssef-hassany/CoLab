"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteTaskCategory } from "@/hooks/server/task-categories/useDeleteTaskCategory";
import { TaskCategory } from "@/types/Task";
import { toast } from "sonner";

interface DeleteCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: TaskCategory | null;
  teamId: string;
}

export function DeleteCategoryModal({
  open,
  onOpenChange,
  category,
  teamId,
}: DeleteCategoryModalProps) {
  const { mutateAsync: deleteCategory, isPending } = useDeleteTaskCategory();

  const handleDeleteCategory = async () => {
    if (teamId && category) {
      await deleteCategory(
        {
          teamId,
          categoryId: category.id,
        },
        {
          onSuccess: () => {
            toast.success("Category deleted successfully");
            onOpenChange(false);
          },
          onError: () => {
            toast.error("Failed to delete category");
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Task Category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{category?.categoryName}"? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteCategory}
            className="bg-red-600 hover:bg-red-700"
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
