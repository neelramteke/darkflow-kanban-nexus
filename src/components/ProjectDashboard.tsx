import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tables } from '@/integrations/supabase/types';
import { ClipboardList, CheckSquare, Clock, AlertCircle, FileText, Link2, Calendar } from 'lucide-react';
import { useProjectData } from '@/hooks/useProjectData';

interface ProjectDashboardProps {
  projectId: string;
  project: Tables<'projects'>;
}

const ProjectDashboard = ({ projectId, project }: ProjectDashboardProps) => {
  const { data, loading } = useProjectData(projectId);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white">Project Overview</h2>
        <div className="text-gray-400">Loading dashboard data...</div>
      </div>
    );
  }

  // Calculate task statistics
  const completedTasks = data.tasks.filter(task => task.completed).length;
  const upcomingTasks = data.tasks.filter(task => {
    if (!task.task_date) return false;
    const taskDate = new Date(task.task_date);
    const now = new Date();
    const weekFromNow = new Date();
    weekFromNow.setDate(now.getDate() + 7);
    return taskDate >= now && taskDate <= weekFromNow && !task.completed;
  }).length;

  const overdueTasks = data.tasks.filter(task => {
    if (!task.task_date) return false;
    const taskDate = new Date(task.task_date);
    const now = new Date();
    return taskDate < now && !task.completed;
  }).length;

  // Calculate card statistics
  const completedCards = data.cards.filter(card => card.completed).length;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Project Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Tasks</CardTitle>
            <ClipboardList className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.tasks.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Completed Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{completedTasks}</div>
            <p className="text-xs text-gray-400">
              {data.tasks.length > 0 ? Math.round((completedTasks / data.tasks.length) * 100) : 0}% complete
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Upcoming Deadlines</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{upcomingTasks}</div>
            <p className="text-xs text-gray-400">Within next 7 days</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{overdueTasks}</div>
            <p className="text-xs text-gray-400">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Cards</CardTitle>
            <ClipboardList className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.cards.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Completed Cards</CardTitle>
            <CheckSquare className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{completedCards}</div>
            <p className="text-xs text-gray-400">
              {data.cards.length > 0 ? Math.round((completedCards / data.cards.length) * 100) : 0}% complete
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Notes</CardTitle>
            <FileText className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.notes.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Links</CardTitle>
            <Link2 className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.links.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.tasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-start gap-4">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    task.completed ? 'bg-green-500' : 'bg-blue-500'
                  }`}>
                    <Calendar size={16} className="text-white" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${
                      task.completed ? 'text-gray-400 line-through' : 'text-white'
                    }`}>
                      Task "{task.title}"
                    </p>
                    <p className="text-xs text-gray-400">
                      {task.task_date ? new Date(task.task_date).toLocaleDateString() : 'No date'}
                      {task.completed && task.completed_at && (
                        <span className="text-green-400 ml-2">
                          ✓ Completed {new Date(task.completed_at).toLocaleDateString()}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
              
              {data.cards.slice(0, 2).map((card) => (
                <div key={card.id} className="flex items-start gap-4">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    card.completed ? 'bg-green-500' : 'bg-purple-500'
                  }`}>
                    <ClipboardList size={16} className="text-white" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${
                      card.completed ? 'text-gray-400 line-through' : 'text-white'
                    }`}>
                      Card "{card.title}"
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(card.created_at).toLocaleDateString()}
                      {card.completed && card.completed_at && (
                        <span className="text-green-400 ml-2">
                          ✓ Completed {new Date(card.completed_at).toLocaleDateString()}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}

              {data.tasks.length === 0 && data.cards.length === 0 && (
                <p className="text-gray-400 text-sm">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Progress Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Tasks Progress</span>
                  <span className="text-gray-300">
                    {data.tasks.length > 0 ? Math.round((completedTasks / data.tasks.length) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${data.tasks.length > 0 ? (completedTasks / data.tasks.length) * 100 : 0}%` 
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Cards Progress</span>
                  <span className="text-gray-300">
                    {data.cards.length > 0 ? Math.round((completedCards / data.cards.length) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${data.cards.length > 0 ? (completedCards / data.cards.length) * 100 : 0}%` 
                    }}
                  />
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <p className="text-gray-400 text-sm">{upcomingTasks} upcoming tasks this week</p>
                <p className="text-gray-400 text-sm">{data.tasks.length} total tasks</p>
                {overdueTasks > 0 && (
                  <p className="text-red-400 text-sm">{overdueTasks} overdue tasks</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDashboard;