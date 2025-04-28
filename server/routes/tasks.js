import express from 'express';
import Task from '../models/Task.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all tasks for user, with optional status filter
router.get('/', auth, async (req, res) => {
  const { status } = req.query;
  const filter = { user: req.user };
  if (status && ['complete', 'incomplete'].includes(status)) {
    filter.status = status;
  }
  try {
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new task
router.post('/', auth, async (req, res) => {
  const { title, description, priority } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });
  try {
    const task = new Task({
      title,
      description,
      priority,
      user: req.user,
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task (mark complete/incomplete or edit)
router.patch('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );
    console.log('[PATCH] Updated Task:', task);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const plainTask = task.toObject();
    plainTask._id = plainTask._id.toString();
    plainTask.user = plainTask.user.toString();
    console.log('[PATCH] Updated Task:', plainTask);
    res.json(plainTask);
    console.log('[PATCH] Response sent for task:', plainTask._id);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
