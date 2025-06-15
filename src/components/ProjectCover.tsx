
import React from 'react';
import { ProjectWithCover } from '@/types/project-extensions';
import { SparklesCore } from '@/components/ui/sparkles';

interface ProjectCoverProps {
  project: ProjectWithCover;
  children?: React.ReactNode;
}

const ProjectCover = ({ project, children }: ProjectCoverProps) => {
  return (
    <div className="relative">
      <div className="h-64 relative overflow-hidden">
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1.3}
          particleDensity={420}
          className="absolute inset-0 w-full h-full z-0"
          particleColor="#FFFFFF"
        />
        {/* Gradients for glow effect */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

        <div className="absolute inset-0 bg-black bg-opacity-30 z-10" />
        <div className="absolute inset-0 flex items-center justify-center z-20">
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
