
import React from 'react';
import { Tables } from '@/integrations/supabase/types';

interface ProjectWithCover extends Tables<'projects'> {
  // Removed cover_image field as it's no longer needed
}

interface ProjectCoverProps {
  project: ProjectWithCover;
  children?: React.ReactNode;
}

const ProjectCover = ({ project, children }: ProjectCoverProps) => {
  return (
    <div className="relative">
      <div 
        className="h-64 relative overflow-hidden"
        style={{
          background: 'linear-gradient(45deg, #0a192f, #112240, #1a365d, #0d2b57)',
          backgroundSize: '400% 400%',
          animation: 'gradient 8s ease infinite' // Changed from 15s to 8s for faster animation
        }}
      >
        <style jsx>{`
          @keyframes gradient {
            0% { background-position: 0% 50% }
            50% { background-position: 100% 50% }
            100% { background-position: 0% 50% }
          }
        `}</style>
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">{project.name}</h1>
            {project.description && (
              <p className="text-xl text-gray-200 max-w-2xl mx-auto">{project.description}</p>
            )}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default ProjectCover;
