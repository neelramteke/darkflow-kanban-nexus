
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

interface ProjectInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Tables<"projects">;
}

const ProjectInviteDialog = ({ open, onOpenChange, project }: ProjectInviteDialogProps) => {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleInvite = async () => {
    setSending(true);
    // Basic email validation
    if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      setSending(false);
      return;
    }

    // Try inserting invite row
    const { error } = await supabase
      .from("project_invites")
      .insert({
        project_id: project.id,
        email: email.trim(),
        // invited_by will be handled by RLS/trigger, but can pass `user.id` if available
      });

    if (error) {
      toast({
        title: "Failed to send invite",
        description: error.message || "Could not send invite.",
        variant: "destructive",
      });
    } else {
      toast({ title: "Invite sent!", description: `Invitation sent to ${email}` });
      setEmail("");
      onOpenChange(false);
    }
    setSending(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Contributor</DialogTitle>
        </DialogHeader>
        <div>
          <Input
            placeholder="Enter contributor's email…"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={sending}
            className="mb-4"
          />
          <small className="text-gray-400">
            They'll receive an invite and, after signing up, will see this project in their dashboard.
          </small>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleInvite} 
            disabled={sending || !email}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {sending ? "Sending..." : "Send Invite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectInviteDialog;
