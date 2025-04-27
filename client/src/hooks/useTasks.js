import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export default function useTasks() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch tasks
  const fetchTasks = useCallback(async (statusFilter = null) => {
    setLoading(true);
    setError(null);
    try {
      let url = 'http://localhost:5000/api/tasks';
      if (statusFilter && statusFilter !== 'all') {
        url += `?status=${statusFilter}`;
      }
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch tasks');
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Add task
  const addTask = async (task) => {
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add task');
      setTasks((prev) => [data, ...prev]);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Update task
  const updateTask = async (id, updates) => {
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update task');
      setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete task');
      setTasks((prev) => prev.filter((t) => t._id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return { tasks, loading, error, fetchTasks, addTask, updateTask, deleteTask };
}
