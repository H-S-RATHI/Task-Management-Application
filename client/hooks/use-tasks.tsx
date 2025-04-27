"use client"

import { useState, useEffect } from "react"
import type { Task } from "@/lib/types"
import { getUserTasks, addTask, updateTask, deleteTask } from "@/lib/tasks"

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const userTasks = await getUserTasks()
      setTasks(userTasks)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tasks")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return { tasks, loading, error, refetch: fetchTasks }
}

export function useTaskActions() {
  const handleAddTask = async (taskData: {
    title: string
    description?: string
    priority: string
  }) => {
    try {
      await addTask(taskData)
    } catch (err) {
      throw err
    }
  }

  const handleUpdateTask = async (taskData: Task) => {
    try {
      await updateTask(taskData)
    } catch (err) {
      throw err
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId)
    } catch (err) {
      throw err
    }
  }

  return { addTask: handleAddTask, updateTask: handleUpdateTask, deleteTask: handleDeleteTask }
}
