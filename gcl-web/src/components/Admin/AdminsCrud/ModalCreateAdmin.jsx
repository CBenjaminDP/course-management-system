import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const ModalCreateAdmin = ({ open, handleClose, handleCreate }) => {
  const [formData, setFormData] = useState({
    username: '',
    nombre_completo: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreate({
      ...formData,
      rol: 'admin',
      fecha_creacion: new Date().toISOString()
    });
    setFormData({
      username: '',
      nombre_completo: '',
      email: '',
      password: ''
    });
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-create-admin"
    >
      <Box sx={style}>
        <Typography variant="h6" component="h2" gutterBottom>
          Add New Admin
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="nombre_completo"
              label="Full Name"
              value={formData.nombre_completo}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
            />
            <Button type="submit" variant="contained">
              Create Admin
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalCreateAdmin;