import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, TextField, MenuItem, Paper, Grid, CircularProgress, ToggleButtonGroup, ToggleButton, Alert } from '@mui/material';
import TaskItem from './TaskItem';
import useTasks from '../hooks/useTasks';

export default function TaskDashboard() {
  const { tasks, loading, error, fetchTasks, addTask, updateTask, deleteTask } = useTasks();
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ title: '', description: '', priority: 'Low' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchTasks(filter);
    // eslint-disable-next-line
  }, [filter]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!form.title) {
      setFormError('Title is required');
      return;
    }
    setFormError('');
    const success = await addTask(form);
    if (success) setForm({ title: '', description: '', priority: 'Low' });
  };

  const handleToggle = (task) => {
    updateTask(task._id, { status: task.status === 'complete' ? 'incomplete' : 'complete' });
  };

  const handleDelete = (task) => {
    deleteTask(task._id);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>Task Dashboard</Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleAddTask}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField label="Title" name="title" value={form.title} onChange={handleInputChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Description" name="description" value={form.description} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField select label="Priority" name="priority" value={form.priority} onChange={handleInputChange} fullWidth>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button type="submit" variant="contained" fullWidth>Add Task</Button>
            </Grid>
          </Grid>
          {formError && <Alert severity="error" sx={{ mt: 2 }}>{formError}</Alert>}
        </form>
      </Paper>

      <Box display="flex" justifyContent="center" mb={2}>
        <ToggleButtonGroup value={filter} exclusive onChange={(_, val) => val && setFilter(val)}>
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="incomplete">Active</ToggleButton>
          <ToggleButton value="complete">Completed</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {loading && <Box display="flex" justifyContent="center"><CircularProgress /></Box>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {tasks.length === 0 && !loading ? (
        <Typography align="center" color="text.secondary">No tasks found.</Typography>
      ) : (
        tasks.map((task) => (
          <TaskItem key={task._id} task={task} onToggle={handleToggle} onDelete={handleDelete} />
        ))
      )}
    </Box>
  );
}
