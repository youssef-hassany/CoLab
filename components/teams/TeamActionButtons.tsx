"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, LogOut, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLeaveTeam } from "@/hooks/server/teams/useLeaveTeam";
import { useDeleteTeam } from "@/hooks/server/teams/useDeleteTeam";
import { toast } from "sonner";

interface TeamActionButtonsProps {
  teamId: string;
  teamName: string;
  teamTheme: string;
  joinCode: string;
  isOwner: boolean;
}

export function TeamActionButtons({
  teamId,
  teamName,
  teamTheme,
  joinCode,
  isOwner,
}: TeamActionButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const leaveTeamMutation = useLeaveTeam();
  const deleteTeamMutation = useDeleteTeam();

  const handleCopyJoinCode = async () => {
    if (joinCode) {
      try {
        await navigator.clipboard.writeText(joinCode);
        setCopied(true);
        toast.success("Join code copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast.error("Failed to copy join code");
        console.error(err);
      }
    }
  };

  const handleLeaveTeam = () => {
    if (teamId) {
      leaveTeamMutation.mutate(teamId, {
        onSuccess: () => {
          toast.success("Successfully left the team");
          setShowLeaveModal(false);
        },
        onError: () => {
          toast.error("Failed to leave team");
        },
      });
    }
  };

  const handleDeleteTeam = () => {
    if (teamId) {
      deleteTeamMutation.mutate(teamId, {
        onSuccess: () => {
          toast.success("Team deleted successfully");
          setShowDeleteModal(false);
        },
        onError: () => {
          toast.error("Failed to delete team");
        },
      });
    }
  };

  return (
    <div className="space-y-3">
      {/* Invite Member Button */}
      <Button
        onClick={handleCopyJoinCode}
        className={`w-full bg-${teamTheme}-600 hover:bg-${teamTheme}-700 text-white`}
        disabled={!joinCode}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-2" />
            Invite Member
          </>
        )}
      </Button>

      {/* Leave Team Button */}
      <Dialog open={showLeaveModal} onOpenChange={setShowLeaveModal}>
        <DialogTrigger asChild>
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white border-red-600"
            disabled={leaveTeamMutation.isPending}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Leave Team
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Team</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave &quot;{teamName}&quot;? You will
              lose access to all team data and tasks.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLeaveModal(false)}
              disabled={leaveTeamMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleLeaveTeam}
              className="bg-red-600 hover:bg-red-700"
              disabled={leaveTeamMutation.isPending}
            >
              {leaveTeamMutation.isPending ? "Leaving..." : "Leave Team"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Team Button - Only for owners */}
      {isOwner && (
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogTrigger asChild>
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white border-red-600"
              disabled={deleteTeamMutation.isPending}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Team</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &quot;{teamName}&quot;? This
                action cannot be undone and will permanently remove the team and
                all its data for all members.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteTeamMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteTeam}
                className="bg-red-600 hover:bg-red-700"
                disabled={deleteTeamMutation.isPending}
              >
                {deleteTeamMutation.isPending ? "Deleting..." : "Delete Team"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
