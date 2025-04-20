import React, { useState, useEffect } from 'react';
import {
  Box,
  Modal,
  TextField,
  Button,
  Typography,
} from '@mui/material';

const ModalUpdateAdmin = ({ open, onClose, onUpdate, admin }) => {
  const [formData, setFormData] = useState({
    username: '',
    nombre_completo: '',
    email: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (admin) {
      setFormData({
        username: admin.username,
        nombre_completo: admin.nombre_completo,
        email: admin.email,
      });
    }
  }, [admin]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'El nombre de usuario es requerido';
    if (!formData.nombre_completo) newErrors.nombre_completo = 'El nombre completo es requerido';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Se requiere un correo válido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedData = {
      username: formData.username,
      nombre_completo: formData.nombre_completo,
      email: formData.email
    };

    onUpdate(admin.id, updatedData);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '12px',
          width: '500px',
          boxShadow: 24,
          p: 3
        }}
      >
        <Box
          sx={{
            backgroundColor: '#1976d2',
            color: '#fff',
            borderRadius: '12px 12px 0 0',
            p: 2,
            mb: 2
          }}
        >
          <Typography variant="h6">Actualizar Administrador</Typography>
        </Box>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <TextField
            fullWidth
            margin="normal"
            label="Nombre de Usuario"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Nombre Completo"
            name="nombre_completo"
            value={formData.nombre_completo}
            onChange={handleChange}
            error={!!errors.nombre_completo}
            helperText={errors.nombre_completo}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Correo Electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={onClose}
              sx={{ borderRadius: '20px' }}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              sx={{ borderRadius: '20px' }}
            >
              Actualizar
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalUpdateAdmin;