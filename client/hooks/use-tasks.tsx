"use client"

import { useState, useEffect } from "react"
import type { Task } from "@/lib/types"
import { getUserTasks, addTask, updateTask, deleteTask } from "@/lib/tasks"

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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

    fetchTasks()
  }, [])

  return { tasks, loading, error }
}

export function useTaskActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddTask = async (taskData: {
    title: string
    description?: string
    priority: string
  }) => {
    try {
      setLoading(true)
      await addTask(taskData)
      // Refresh tasks after adding
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add task")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateTask = async (taskData: Task) => {
    try {
      setLoading(true)
      await updateTask(taskData)
      // Refresh tasks after updating
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      setLoading(true)
      await deleteTask(taskId)
      // Refresh tasks after deleting
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    addTask: handleAddTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    loading,
    error,
  }
}
