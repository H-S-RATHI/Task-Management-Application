"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { TaskList } from "@/components/task-list"
import { TaskForm } from "@/components/task-form"
import { useAuth } from "@/hooks/use-auth"
import { useTasks } from "@/hooks/use-tasks"
import type { Task } from "@/lib/types"

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading, logout } = useAuth()
  const { tasks, loading: tasksLoading, error } = useTasks()
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [activeFilter, setActiveFilter] = useState("all")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleCloseForm = () => {
    setShowTaskForm(false)
    setEditingTask(null)
  }

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === "active") return !task.completed
    if (activeFilter === "completed") return task.completed
    return true
  })

  if (authLoading || !user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Dashboard</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowTaskForm(true)} className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Add Task
          </Button>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>

      {showTaskForm && (
        <Card className="mb-6 p-4">
          <TaskForm onClose={handleCloseForm} editTask={editingTask} />
        </Card>
      )}

      <Tabs defaultValue="all" value={activeFilter} onValueChange={setActiveFilter}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value={activeFilter}>
          {tasksLoading ? (
            <div className="text-center py-4">Loading tasks...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tasks found. Click &quot;Add Task&quot; to create one.
            </div>
          ) : (
            <TaskList tasks={filteredTasks} onEdit={handleEditTask} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
