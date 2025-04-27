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
  // Map _id to id for all tasks
  const tasks = await res.json();
  return tasks.map((task: any) => ({ ...task, id: task._id }));
}

// Add a new task
export async function addTask(taskData: {
  title: string
  description?: string
  priority: string
}): Promise<Task> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Unauthorized');
  // Ensure priority is valid for backend
  let backendPriority = taskData.priority;
  if (backendPriority.toLowerCase() === 'low') backendPriority = 'Low';
  else if (backendPriority.toLowerCase() === 'medium') backendPriority = 'Medium';
  else if (backendPriority.toLowerCase() === 'high') backendPriority = 'High';
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: taskData.title,
      description: taskData.description,
      priority: backendPriority,
      status: 'incomplete', // default for new tasks
    })
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to add task');
  }
  // Map _id to id for the returned task
  const task = await res.json();
  return { ...task, id: task._id };
}

// Update a task
export async function updateTask(taskData: Task): Promise<Task> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Unauthorized');
  // Only send updatable fields (title, description, priority, status)
  const updateBody: any = {
    title: taskData.title,
    description: taskData.description,
    priority: taskData.priority,
    // Map completed boolean to status string for backend
    status: taskData.completed ? 'complete' : 'incomplete',
  };
  const res = await fetch(`${API_URL}/${taskData.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updateBody)
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to update task');
  }
  // Map _id to id for the returned task
  const task = await res.json();
  return { ...task, id: task._id };
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
