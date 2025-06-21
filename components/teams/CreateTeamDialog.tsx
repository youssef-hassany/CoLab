import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useCreateTeam } from "@/hooks/server/teams/useCreateTeam";
import ImageCropper from "../common/ImageCropper";

// Zod schema for form validation
const createTeamSchema = z.object({
  teamName: z
    .string()
    .min(1, "Team name is required")
    .min(2, "Team name must be at least 2 characters"),
  theme: z.string().min(1, "Please select a theme"),
});

type CreateTeamFormData = z.infer<typeof createTeamSchema>;

interface CreateTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTeamDialog({
  open,
  onOpenChange,
}: CreateTeamDialogProps) {
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [croppedImageFile, setCroppedImageFile] = useState<File | null>(null);

  const { mutateAsync: createTeam, isPending: isSubmitting } = useCreateTeam();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateTeamFormData>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      teamName: "",
      theme: "blue",
    },
  });

  // This function will be called when the ImageCropper completes cropping
  const handleCropSubmit = (file: File) => {
    // Store the file for form submission
    setCroppedImageFile(file);

    // Convert file to data URL for display
    const reader = new FileReader();
    reader.onload = (e) => {
      setCroppedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setCroppedImage(null);
    setCroppedImageFile(null);
  };

  const onSubmit = async (data: CreateTeamFormData) => {
    try {
      const formData = new FormData();

      formData.append("teamName", data.teamName);
      formData.append("theme", data.theme);

      // Append the actual file, not the data URL
      if (croppedImageFile) {
        formData.append("teamLogo", croppedImageFile);
      }

      await createTeam(formData);

      handleDialogClose(false);
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const handleDialogClose = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      // Reset form when dialog closes
      reset();
      setCroppedImage(null);
      setCroppedImageFile(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Set up your new team. You can always change these settings later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="team-name">Team Name</Label>
              <Input
                id="team-name"
                placeholder="Enter team name"
                {...register("teamName")}
                className={errors.teamName ? "border-red-500" : ""}
              />
              {errors.teamName && (
                <p className="text-sm text-red-500">
                  {errors.teamName.message}
                </p>
              )}
            </div>

            {/* Image Section */}
            <div className="grid gap-3">
              <Label>Team Logo</Label>
              {croppedImage ? (
                <div className="relative inline-block">
                  <img
                    src={croppedImage}
                    alt="Cropped team logo"
                    className="w-32 h-32 object-cover rounded-lg border border-zinc-300"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <ImageCropper
                  submitFunction={handleCropSubmit}
                  imgStyle="w-32 h-32 object-cover rounded-lg border border-zinc-300"
                />
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="team-theme">Team Color</Label>
              <Controller
                name="theme"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={errors.theme ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Choose a color theme" />
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
                )}
              />
              {errors.theme && (
                <p className="text-sm text-red-500">{errors.theme.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Team"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
