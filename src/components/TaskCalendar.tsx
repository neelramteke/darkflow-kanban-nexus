import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tables } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Clock, Calendar as CalendarIcon, Edit, Trash2 } from 'lucide-react';
import { TaskWithCompletion } from '@/types/project-extensions';
interface TaskCalendarProps {
  projectId: string;
}

// Use TaskWithCompletion for task type
type Task = TaskWithCompletion;
const TaskCalendar = ({
  projectId
}: TaskCalendarProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    status: 'pending'
  });
  const [loading, setLoading] = useState(true);
  const {
    toast
  } = useToast();
  const loadTasks = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('project_tasks').select('*').eq('project_id', projectId).order('task_date', {
        ascending: true
      });
      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading tasks",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadTasks();
  }, [projectId]);
  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;
    try {
      const {
        error
      } = await supabase.from('project_tasks').insert({
        project_id: projectId,
        title: newTask.title.trim(),
        description: newTask.description.trim() || null,
        task_date: selectedDate.toISOString().split('T')[0],
        start_time: newTask.start_time || null,
        end_time: newTask.end_time || null,
        status: newTask.status,
        completed: false
      });
      if (error) throw error;
      toast({
        title: "Task created",
        description: "Your task has been added to the calendar."
      });
      setNewTask({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        status: 'pending'
      });
      setShowCreateDialog(false);
      loadTasks();
    } catch (error: any) {
      toast({
        title: "Error creating task",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const handleUpdateTask = async () => {
    if (!editingTask || !newTask.title.trim()) return;
    try {
      const {
        error
      } = await supabase.from('project_tasks').update({
        title: newTask.title.trim(),
        description: newTask.description.trim() || null,
        start_time: newTask.start_time || null,
        end_time: newTask.end_time || null,
        status: newTask.status,
        updated_at: new Date().toISOString()
      }).eq('id', editingTask.id);
      if (error) throw error;
      toast({
        title: "Task updated",
        description: "Your changes have been saved."
      });
      setEditingTask(null);
      setNewTask({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        status: 'pending'
      });
      loadTasks();
    } catch (error: any) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const handleDeleteTask = async (taskId: string) => {
    try {
      const {
        error
      } = await supabase.from('project_tasks').delete().eq('id', taskId);
      if (error) throw error;
      toast({
        title: "Task deleted",
        description: "The task has been removed."
      });
      loadTasks();
    } catch (error: any) {
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const handleCompletionToggle = async (task: Task, completed: boolean) => {
    try {
      const {
        error
      } = await supabase.from('project_tasks').update({
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        status: completed ? 'completed' : 'pending',
        updated_at: new Date().toISOString()
      }).eq('id', task.id);
      if (error) throw error;
      toast({
        title: completed ? "Task completed" : "Task marked incomplete",
        description: `"${task.title}" has been ${completed ? 'completed' : 'marked as incomplete'}.`
      });
      loadTasks();
    } catch (error: any) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || '',
      start_time: task.start_time || '',
      end_time: task.end_time || '',
      status: task.status || 'pending'
    });
  };
  const closeDialog = () => {
    setShowCreateDialog(false);
    setEditingTask(null);
    setNewTask({
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      status: 'pending'
    });
  };
  const selectedDateTasks = tasks.filter(task => task.task_date === selectedDate.toISOString().split('T')[0]);
  const datesWithTasks = new Set(tasks.map(task => task.task_date));
  const statusColors = {
    pending: 'bg-yellow-600',
    'in-progress': 'bg-blue-600',
    completed: 'bg-green-600',
    cancelled: 'bg-gray-600'
  };
  if (loading) {
    return <div className="flex items-center justify-center h-96">
        <div className="text-gray-400">Loading calendar...</div>
      </div>;
  }
  return <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Task Calendar</h2>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar - Takes more space on desktop */}
        <Card className="bg-gray-900 border-gray-800 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center justify-between">
              <span>Calendar</span>
              <span className="text-sm font-normal text-blue-400">
                {selectedDate.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <Calendar mode="single" selected={selectedDate} onSelect={date => date && setSelectedDate(date)} modifiers={{
            hasTask: date => datesWithTasks.has(date.toISOString().split('T')[0])
          }} modifiersStyles={{
            hasTask: {
              backgroundColor: '#1e40af',
              color: 'white'
            }
          }} className="border border-gray-700 rounded-lg mx-[25px] px-0 py-0" />
          </CardContent>
        </Card>

        {/* Selected Date Tasks - Takes more space on desktop */}
        <Card className="bg-gray-900 border-gray-800 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                <span>{selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <Badge className="bg-blue-600">
                {selectedDateTasks.length} {selectedDateTasks.length === 1 ? 'task' : 'tasks'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateTasks.length === 0 ? <div className="text-gray-400 text-center py-12 flex flex-col items-center">
                <CalendarIcon className="h-12 w-12 mb-3 text-gray-600" />
                <p>No tasks scheduled for this date.</p>
                <Button variant="outline" size="sm" onClick={() => setShowCreateDialog(true)} className="mt-4 border-gray-700 text-gray-300">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div> : <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedDateTasks.map(task => <div key={task.id} className="bg-gray-800 rounded-lg p-4 border-l-4 border-l-blue-600 hover:bg-gray-750 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        <Checkbox checked={task.completed || false} onCheckedChange={checked => handleCompletionToggle(task, checked as boolean)} className="border-gray-500 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" />
                        <h4 className={`font-medium text-white ${task.completed ? 'line-through text-gray-400' : ''}`}>
                          {task.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${statusColors[task.status as keyof typeof statusColors]} text-white`}>
                          {task.status}
                        </Badge>
                        <Button size="sm" variant="ghost" onClick={() => openEditDialog(task)} className="text-gray-400 hover:text-white">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteTask(task.id)} className="text-gray-400 hover:text-red-400">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {task.description && <p className={`text-sm mb-3 pl-6 ${task.completed ? 'text-gray-500' : 'text-gray-300'}`}>
                        {task.description}
                      </p>}
                    
                    {(task.start_time || task.end_time) && <div className="flex items-center gap-2 text-gray-400 text-sm pl-6">
                        <Clock className="h-3 w-3" />
                        {task.start_time && task.end_time ? <span>{task.start_time} - {task.end_time}</span> : task.start_time ? <span>Starts at {task.start_time}</span> : <span>Ends at {task.end_time}</span>}
                      </div>}

                    {task.completed && task.completed_at && <div className="text-xs text-green-400 mt-2 pl-6">
                        ✓ Completed {new Date(task.completed_at).toLocaleDateString()}
                      </div>}
                  </div>)}
              </div>}
          </CardContent>
        </Card>
      </div>

      {/* Add this CSS for custom scrollbar */}
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #1f2937;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #374151;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #4b5563;
          }
          @media (max-width: 768px) {
            .rdp {
              --rdp-cell-size: 36px;
              margin: 0 auto;
            }
            .rdp-caption {
              padding: 0 8px;
            }
          }
        `}
      </style>

      {/* Create/Edit Task Dialog */}
      <Dialog open={showCreateDialog || !!editingTask} onOpenChange={closeDialog}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300">Title</label>
              <Input value={newTask.title} onChange={e => setNewTask({
              ...newTask,
              title: e.target.value
            })} className="bg-gray-800 border-gray-700 text-white" placeholder="Task title" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">Description</label>
              <Textarea value={newTask.description} onChange={e => setNewTask({
              ...newTask,
              description: e.target.value
            })} className="bg-gray-800 border-gray-700 text-white" placeholder="Task description (optional)" rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Start Time</label>
                <Input type="time" value={newTask.start_time} onChange={e => setNewTask({
                ...newTask,
                start_time: e.target.value
              })} className="bg-gray-800 border-gray-700 text-white" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">End Time</label>
                <Input type="time" value={newTask.end_time} onChange={e => setNewTask({
                ...newTask,
                end_time: e.target.value
              })} className="bg-gray-800 border-gray-700 text-white" />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={closeDialog} className="border-gray-700 text-gray-300">
                Cancel
              </Button>
              <Button onClick={editingTask ? handleUpdateTask : handleCreateTask} className="bg-blue-600 hover:bg-blue-700">
                {editingTask ? 'Update Task' : 'Create Task'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
};
export default TaskCalendar;