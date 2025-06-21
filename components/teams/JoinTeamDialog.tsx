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

interface JoinTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JoinTeamDialog({ open, onOpenChange }: JoinTeamDialogProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Joining team...");
    onOpenChange(false); // Close dialog after submission
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Team</DialogTitle>
          <DialogDescription>
            Enter the team invitation code or team ID to join an existing team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="team-code">Team Code or ID</Label>
              <Input
                id="team-code"
                name="teamCode"
                placeholder="Enter team invitation code"
                required
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit">Join Team</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
