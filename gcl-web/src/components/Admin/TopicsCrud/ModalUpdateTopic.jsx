import React, { useState, useEffect } from 'react';
import {
  Modal, Typography, TextField, Button, Box,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

// Theme colors to match the rest of the application
const theme = {
  primary: "#FFD700", // Gold
  secondary: "#4A4A4A",
  text: "#333333",
  hover: "#E6C200",
  background: "#f8f9fa",
};

const ModalUpdateTopic = ({ open, onClose, topic, onSave }) => {
  const [updatedTopic, setUpdatedTopic] = useState({
    id: '',
    nombre: '',
    descripcion: '',
    orden: 1,
    unidad: ''
  });
  const [errors, setErrors] = useState({});

  // Update form when topic changes
  useEffect(() => {
    if (topic && open) {
      setUpdatedTopic({
        id: topic.id,
        nombre: topic.nombre || '',
        descripcion: topic.descripcion || '',
        orden: topic.orden || 1,
        unidad: topic.unidad?.id || topic.unidad || ''
      });
    }
  }, [topic, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTopic({
      ...updatedTopic,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!updatedTopic.nombre) newErrors.nombre = 'El nombre es requerido';
    if (!updatedTopic.descripcion) newErrors.descripcion = 'La descripción es requerida';
    if (!updatedTopic.orden) newErrors.orden = 'El orden es requerido';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: updatedTopic.id,
      nombre: updatedTopic.nombre.trim(),
      descripcion: updatedTopic.descripcion.trim(),
      orden: parseInt(updatedTopic.orden),
      unidad: updatedTopic.unidad
    });
  };

  const isFormValid = () => {
    return (
      updatedTopic.nombre && 
      updatedTopic.descripcion && 
      updatedTopic.orden
    );
  };

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ backgroundColor: 'white', borderRadius: '12px', width: '500px', boxShadow: 24, p: 3 }}>
        <Box sx={{ 
          backgroundColor: theme.primary, 
          color: theme.secondary, 
          borderRadius: '12px 12px 0 0', 
          p: 2, 
          mb: 2 
        }}>
          <Typography variant="h6" fontWeight={600}>Editar Tema</Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Nombre del Tema"
            name="nombre"
            value={updatedTopic.nombre}
            onChange={handleChange}
            error={!!errors.nombre}
            helperText={errors.nombre}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Descripción"
            name="descripcion"
            value={updatedTopic.descripcion}
            onChange={handleChange}
            error={!!errors.descripcion}
            helperText={errors.descripcion}
            multiline
            rows={4}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Orden"
            name="orden"
            type="number"
            value={updatedTopic.orden}
            onChange={handleChange}
            error={!!errors.orden}
            helperText={errors.orden}
            InputProps={{ inputProps: { min: 1 } }}
            required
          />

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={onClose}
              sx={{ 
                borderRadius: '20px',
                borderColor: theme.primary,
                color: theme.secondary,
                '&:hover': {
                  borderColor: theme.hover,
                  backgroundColor: 'rgba(255, 215, 0, 0.04)'
                }
              }}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              sx={{ 
                borderRadius: '20px',
                backgroundColor: theme.primary,
                color: theme.secondary,
                '&:hover': {
                  backgroundColor: theme.hover
                },
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(255, 215, 0, 0.3)',
                  color: 'rgba(74, 74, 74, 0.5)'
                }
              }}
              disabled={!isFormValid()}
            >
              Actualizar
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalUpdateTopic;