
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

interface ProjectInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Tables<"projects">;
}

const ProjectInviteDialog = ({ open, onOpenChange }: ProjectInviteDialogProps) => {
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

    // Inform that invites by email are not currently available
    toast({
      title: "Feature not available",
      description: "Inviting by email is not available yet. Please add the contributor by user ID.",
      variant: "destructive",
    });
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
            Email invites not available yet. Please contact the user directly.
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
