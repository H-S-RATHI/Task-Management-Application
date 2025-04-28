"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import type { Task } from "@/lib/types"
import { useTaskActions } from "@/hooks/use-tasks"
type Priority = Task["priority"];

interface TaskFormProps {
  onClose: () => void
  editTask: Task | null
}

export function TaskForm({ onClose, editTask }: TaskFormProps) {
  const { addTask, updateTask } = useTaskActions()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<Priority>("Medium")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title)
      setDescription(editTask.description || "")
      setPriority(editTask.priority)
    }
  }, [editTask])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!title.trim()) {
      setError("Title is required")
      return
    }

    try {
      setLoading(true)

      if (editTask) {
        await updateTask({
          ...editTask,
          title,
          description,
          priority,
        })
      } else {
        await addTask({
          title,
          description,
          priority,
        })
      }

      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save task")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
      // Immediately call onClose without waiting for state updates
      onClose();
    }
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{editTask ? "Edit Task" : "Add New Task"}</h2>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={handleClose} 
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description (optional)"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
    value={priority.toLowerCase()}
    onValueChange={(val) => {
      // Map select values to Priority type
      if (val === "low") setPriority("Low")
      else if (val === "medium") setPriority("Medium")
      else if (val === "high") setPriority("High")
    }}
>
            <SelectTrigger id="priority">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : editTask ? "Update Task" : "Add Task"}
          </Button>
        </div>
      </form>
    )
}
