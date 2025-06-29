import KanbanBoard from '@/components/KanbanBoard';
import ProjectNotes from '@/components/ProjectNotes';
import ProjectLinks from '@/components/ProjectLinks';
import ProjectDashboard from '@/components/ProjectDashboard';
import TaskCalendar from '@/components/TaskCalendar';
import ProjectCover from '@/components/ProjectCover';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Kanban, FileText, Link2, Calendar, LayoutDashboard } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectWithCover } from '@/types/project-extensions';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
interface ProjectViewProps {
  project: ProjectWithCover;
  onBack: () => void;
  onUpdate?: () => void;
}
const ProjectView = ({
  project,
  onBack,
  onUpdate
}: ProjectViewProps) => {
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const isMobile = useIsMobile();
  const tabs = [{
    value: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  }, {
    value: 'board',
    label: 'Board',
    icon: Kanban
  }, {
    value: 'calendar',
    label: 'Calendar',
    icon: Calendar
  }, {
    value: 'notes',
    label: 'Notes',
    icon: FileText
  }, {
    value: 'links',
    label: 'Links',
    icon: Link2
  }];
  const renderTabContent = () => {
    switch (selectedTab) {
      case 'dashboard':
        return <ProjectDashboard projectId={project.id} project={project} />;
      case 'board':
        return <KanbanBoard projectId={project.id} />;
      case 'calendar':
        // Custom calendar wrapper for better layout
        return <section className="max-w-5xl mx-auto w-full">
            <div className="mb-6 flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Project Task Calendar</h2>
            </div>
            <div className="rounded-2xl shadow-xl bg-gradient-to-br from-gray-900 via-gray-800 to-black px-2 py-1 md:px-10 md:py-8 border border-[#272748]">
              <TaskCalendar projectId={project.id} />
            </div>
          </section>;
      case 'notes':
        return <ProjectNotes projectId={project.id} />;
      case 'links':
        return <ProjectLinks projectId={project.id} />;
      default:
        return <ProjectDashboard projectId={project.id} project={project} />;
    }
  };
  return <div className="min-h-screen bg-black">
      <ProjectCover project={project}>
        <div className="bg-black border-b border-gray-800">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={onBack} className="text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
            </div>
          </div>
        </div>
      </ProjectCover>

      <div className="container mx-auto px-2 sm:px-6 py-6 md:py-10">
        {isMobile ? <div className="w-full">
            <Select value={selectedTab} onValueChange={setSelectedTab}>
              <SelectTrigger className="w-full bg-gray-900 border-gray-800 text-white mb-6">
                <SelectValue>
                  {tabs.find(tab => tab.value === selectedTab)?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800">
                {tabs.map(tab => {
              const Icon = tab.icon;
              return <SelectItem key={tab.value} value={tab.value} className="text-white focus:bg-gray-700 focus:text-white">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </div>
                    </SelectItem>;
            })}
              </SelectContent>
            </Select>
            
            <div className="mt-6">
              {renderTabContent()}
            </div>
          </div> : <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="bg-gray-900 border-gray-800">
              {tabs.map(tab => {
            const Icon = tab.icon;
            return <TabsTrigger key={tab.value} value={tab.value} className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700">
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </TabsTrigger>;
          })}
            </TabsList>

            <TabsContent value="dashboard" className="mt-6">
              <ProjectDashboard projectId={project.id} project={project} />
            </TabsContent>

            <TabsContent value="board" className="mt-6">
              <KanbanBoard projectId={project.id} />
            </TabsContent>

            <TabsContent value="calendar" className="mt-6">
              {/* Custom calendar wrapper for better layout */}
              <section className="max-w-5xl mx-auto w-full">
                <div className="mb-6 flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-blue-500" />
                  <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Project Task Calendar</h2>
                </div>
                <div className="rounded-2xl shadow-xl bg-gradient-to-br from-gray-900 via-gray-800 to-black px-2 py-1 md:py-8 border border-[#272748] md:px-[11px]">
                  <TaskCalendar projectId={project.id} />
                </div>
              </section>
            </TabsContent>

            <TabsContent value="notes" className="mt-6">
              <ProjectNotes projectId={project.id} />
            </TabsContent>

            <TabsContent value="links" className="mt-6">
              <ProjectLinks projectId={project.id} />
            </TabsContent>
          </Tabs>}
      </div>
    </div>;
};
export default ProjectView;