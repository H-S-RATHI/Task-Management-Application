import type { Task } from "./types"

const API_URL = "http://localhost:5000/api/tasks";

// Local storage helpers removed. All task operations now use backend API.

// Get all tasks for current user
export async function getUserTasks(): Promise<Task[]> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Unauthorized');
  const res = await fetch(API_URL, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to fetch tasks');
  }
  return res.json();
}

// Add a new task
export async function addTask(taskData: {
  title: string
  description?: string
  priority: string
}): Promise<Task> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Unauthorized');
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(taskData)
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to add task');
  }
  return res.json();
}

// Update a task
export async function updateTask(taskData: Task): Promise<Task> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Unauthorized');
  const res = await fetch(`${API_URL}/${taskData.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(taskData)
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to update task');
  }
  return res.json();
}

// Delete a task
export async function deleteTask(taskId: string): Promise<{ success: boolean }> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Unauthorized');
  const res = await fetch(`${API_URL}/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to delete task');
  }
  return res.json();
}
