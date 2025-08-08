"use client";

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
import { useJoinTeam } from "@/hooks/server/teams/useJoinTeam";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface JoinTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JoinTeamDialog({ open, onOpenChange }: JoinTeamDialogProps) {
  const [code, setCode] = useState("");
  const router = useRouter();

  const { mutateAsync: joinTeam, isPending: isLoading } = useJoinTeam();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const teamId = await joinTeam(code);
      router.push(`/teams/${teamId}`);

      onOpenChange(false);
      setCode("");
    } catch (error) {
      console.error(error);
    }
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
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {isLoading ? "Joining Team..." : "Join Team"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
