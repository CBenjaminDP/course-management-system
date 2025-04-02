import React, { useState, useEffect } from 'react';
import {
  Box,
  Modal,
  TextField,
  Button,
  Typography
} from '@mui/material';

const ModalUpdateCourse = ({ open, onClose, onUpdate, course }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name,
        description: course.description
      });
    }
  }, [course]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(course.id, formData);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ /* Add your modal styles here */ }}>
        <Typography variant="h6">Update Course</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Course Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ ml: 2 }}>
              Update
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalUpdateCourse;