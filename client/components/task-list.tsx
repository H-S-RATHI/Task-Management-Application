import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import type { Task } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useTaskActions } from "@/hooks/use-tasks";
import { useToast } from "@/hooks/use-toast";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onTaskChange?: (updatedTasks: Task[]) => void;
}

export function TaskList({ tasks: initialTasks, onEdit, onTaskChange }: TaskListProps) {
  // Use state for local tasks to prevent refreshes from parent
  const [localTasks, setLocalTasks] = useState<Task[]>(initialTasks);
  const [removingTaskIds, setRemovingTaskIds] = useState<string[]>([]);
  const [processingTaskIds, setProcessingTaskIds] = useState<string[]>([]);
  const removeTimeouts = useRef<{[key:string]: NodeJS.Timeout}>({});
  const { toast } = useToast();
  const { updateTask, deleteTask } = useTaskActions();

  // Update local state only when initialTasks change from outside
  useEffect(() => {
    // Only update if there's an actual change in the tasks array
    if (JSON.stringify(initialTasks) !== JSON.stringify(localTasks)) {
      setLocalTasks(initialTasks);
    }
  }, [initialTasks]);

  const toggleTaskCompletion = async (task: Task) => {
    // Prevent multiple clicks
    if (processingTaskIds.includes(task.id)) return;
    
    // Mark as processing
    setProcessingTaskIds(prev => [...prev, task.id]);
    
    // Optimistic update - modify local state immediately
    const updatedTask = { ...task, completed: !task.completed };
    const updatedTasks = localTasks.map(t => 
      t.id === task.id ? updatedTask : t
    );
    
    // Update local state without refreshing the entire list
    setLocalTasks(updatedTasks);
    
    try {
      // Perform backend update (simulated)
      await updateTask(updatedTask);
      
      // Notify parent of change with the updated tasks
      if (onTaskChange) {
        onTaskChange(updatedTasks);
      }
    } catch (err) {
      console.error('Error updating task:', err);
      
      // Revert optimistic update
      setLocalTasks(localTasks);
      
      toast({
        title: "Failed to update task",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      // Remove from processing state
      setProcessingTaskIds(prev => prev.filter(id => id !== task.id));
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    
    // Prevent multiple clicks
    if (processingTaskIds.includes(taskId)) return;
    
    setProcessingTaskIds(prev => [...prev, taskId]);
    // Trigger removal animation
    setRemovingTaskIds(prev => [...prev, taskId]);
    
    // Store the task to restore if needed
    const taskToDelete = localTasks.find(t => t.id === taskId);
    
    // Optimistic update - remove from local state
    const updatedTasks = localTasks.filter(t => t.id !== taskId);
    setLocalTasks(updatedTasks);
    
    // Animation delay before actual deletion
    removeTimeouts.current[taskId] = setTimeout(async () => {
      try {
        // Perform backend delete
        await deleteTask(taskId);
        
        // Notify parent
        if (onTaskChange) {
          onTaskChange(updatedTasks);
        }
      } catch (err) {
        console.error('Error deleting task:', err);
        
        // Restore task on failure
        if (taskToDelete) {
          setLocalTasks(prev => [...prev, taskToDelete]);
        }
        
        toast({
          title: "Failed to delete task",
          description: "Please try again",
          variant: "destructive",
        });
      } finally {
        setRemovingTaskIds(prev => prev.filter(id => id !== taskId));
        setProcessingTaskIds(prev => prev.filter(id => id !== taskId));
        delete removeTimeouts.current[taskId];
      }
    }, 300); // Animation duration
  };

  const getPriorityColor = (priority: "Low" | "Medium" | "High") => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {localTasks.map((task) => {
        const isRemoving = removingTaskIds.includes(task.id);
        const isProcessing = processingTaskIds.includes(task.id);
        return (
          <Card
            key={task.id}
            className={`relative overflow-hidden shadow-md transition-all duration-200 hover:scale-[1.01] hover:shadow-lg border-l-4 ${
              task.priority === 'High'
                ? 'border-red-500'
                : task.priority === 'Medium'
                ? 'border-yellow-400'
                : 'border-green-500'
            } ${task.completed ? 'bg-gray-100 dark:bg-gray-900 opacity-80' : 'bg-white dark:bg-gray-800'}
            ${isRemoving ? 'animate-fade-out' : ''}`}
          >
            <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
              <div className="flex items-start gap-4 w-full">
                <div className="flex flex-col items-center pt-1 mr-2">
                  <div className={`transition-all duration-150 ${isProcessing ? 'opacity-50' : ''}`}>
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      onCheckedChange={() => toggleTaskCompletion(task)}
                      disabled={isProcessing}
                      className={`scale-110 rounded-full border-2 transition-colors ${
                        task.completed ? 'border-green-500 bg-green-500' : 'border-gray-400'
                      }`}
                      title={task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                    />
                  </div>
                  <span className="mt-2">
                    <Badge className={`text-xs px-2 py-0.5 font-semibold tracking-wide ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle
                    className={`text-xl font-bold truncate transition-all duration-200 ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}
                    title={task.title}
                  >
                    {task.title}
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">ID: {task.id}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <CardDescription className="text-xs mt-0">Created: {formatDate(task.createdAt)}</CardDescription>
                  </div>
                  <p className={`mt-2 text-sm whitespace-pre-wrap transition-colors duration-200 ${task.completed ? 'text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>{task.description}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 ml-4">
                <Button
                  type="button"
                  variant={task.completed ? 'outline' : 'secondary'}
                  size="sm"
                  disabled={isProcessing}
                  className={`text-xs px-3 py-1 h-auto min-h-0 min-w-0 rounded shadow-sm border transition-colors duration-200 ${
                    isProcessing ? 'opacity-50 cursor-wait' : ''
                  } ${task.completed ? 'border-green-600 text-green-600 dark:text-green-300' : 'border-gray-400 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleTaskCompletion(task);
                  }}
                  title={task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                >
                  {isProcessing ? (
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing
                    </span>
                  ) : task.completed ? (
                    <span className="flex items-center"><svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Mark Incomplete</span>
                  ) : (
                    <span className="flex items-center"><svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4" /></svg>Mark Complete</span>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardFooter className="p-3 bg-gray-50 dark:bg-gray-900 flex justify-end gap-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
                disabled={isProcessing}
                className="h-8 flex items-center gap-1 hover:bg-blue-50 dark:hover:bg-blue-900"
                title="Edit Task"
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTask(task.id);
                }}
                disabled={isProcessing}
                className="h-8 flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900"
                title="Delete Task"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </CardFooter>
          </Card>
        );
      })}
      
      <style jsx global>{`
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-10px); }
        }
        .animate-fade-out {
          animation: fadeOut 300ms ease-out forwards;
        }
      `}</style>
    </div>
  );
}