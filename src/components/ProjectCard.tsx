
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tables } from '@/integrations/supabase/types';
import { Calendar, UserPlus } from 'lucide-react';
import ProjectActionsMenu from './ProjectActionsMenu';
import { useState } from "react";
import ProjectInviteDialog from './ProjectInviteDialog';
import { useAuth } from '@/hooks/useAuth';

interface ProjectCardProps {
  project: Tables<'projects'>;
  onClick: () => void;
  onUpdate: () => void;
}

const ProjectCard = ({ project, onClick, onUpdate }: ProjectCardProps) => {
  const statusColor = project.status === 'active' ? 'bg-green-600' : 'bg-gray-600';
  const { user } = useAuth();
  const [showInvite, setShowInvite] = useState(false);

  // Only show invite button if the current user is the project owner
  const canInvite = user && user.id === project.user_id;

  return (
    <Card 
      className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer group"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium text-white">
          {project.name}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge className={`${statusColor} text-white`}>
            {project.status}
          </Badge>
          {canInvite && (
            <button
              type="button"
              aria-label="Invite contributor"
              className="opacity-75 hover:opacity-100 transition-opacity text-blue-400"
              onClick={(e) => {
                e.stopPropagation();
                setShowInvite(true);
              }}
              title="Invite contributor"
            >
              <UserPlus className="h-4 w-4" />
            </button>
          )}
          <div 
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <ProjectActionsMenu project={project} onUpdate={onUpdate} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {project.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="h-3 w-3" />
          <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
        </div>
      </CardContent>
      {canInvite && (
        <ProjectInviteDialog 
          open={showInvite}
          onOpenChange={(open) => setShowInvite(open)}
          project={project}
        />
      )}
    </Card>
  );
};

export default ProjectCard;
