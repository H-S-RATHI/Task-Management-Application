import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, IconButton, Chip, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <Card sx={{ mb: 2, opacity: task.status === 'complete' ? 0.6 : 1 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <IconButton onClick={() => onToggle(task)} color={task.status === 'complete' ? 'success' : 'default'}>
              {task.status === 'complete' ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
            </IconButton>
            <Box>
              <Typography variant="h6" sx={{ textDecoration: task.status === 'complete' ? 'line-through' : 'none' }}>
                {task.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {task.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Priority: <Chip label={task.priority} size="small" color={
                  task.priority === 'High' ? 'error' : task.priority === 'Medium' ? 'warning' : 'success'
                } />
                &nbsp;| Created: {new Date(task.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => onDelete(task)} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}

TaskItem.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.oneOf(['complete', 'incomplete']).isRequired,
    priority: PropTypes.oneOf(['Low', 'Medium', 'High']).isRequired,
    createdAt: PropTypes.string,
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
