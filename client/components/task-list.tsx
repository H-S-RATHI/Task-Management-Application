"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import type { Task } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { useTaskActions } from "@/hooks/use-tasks"

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onTaskChange?: () => void
}

export function TaskList({ tasks, onEdit, onTaskChange }: TaskListProps) {
  const { updateTask, deleteTask } = useTaskActions()
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null)

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId)
  }

  const toggleTaskCompletion = async (task: Task) => {
    await updateTask({
      ...task,
      completed: !task.completed,
    })
  }

  const handleDeleteTask = async (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(taskId)
      if (typeof onTaskChange === 'function') {
        onTaskChange()
      }
    }
  }

  const getPriorityColor = (priority: "Low" | "Medium" | "High") => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task)}
                  className="mt-1"
                />
                <div>
                  <CardTitle
                    className={`text-lg ${task.completed ? "line-through text-gray-500" : ""}`}
                  >
                    {task.title}
                  </CardTitle>
                  <div className="text-xs text-gray-400 select-all">ID: {task.id}</div>
                  <CardDescription className="mt-1">Created: {formatDate(task.createdAt)}</CardDescription>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mt-1">
                    {task.description}
                  </p>
                </div>
              </div>
              <Badge className={`${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
            </div>
          </CardHeader>


          <CardFooter className="p-2 bg-gray-50 dark:bg-gray-800 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(task)} className="h-8">
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteTask(task.id)}
              className="h-8 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900"
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
