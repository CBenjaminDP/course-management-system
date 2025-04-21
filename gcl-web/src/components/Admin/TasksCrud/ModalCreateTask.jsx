import React, { useState } from 'react';
import {
  Modal, Typography, TextField, Button, Box,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
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

const ModalCreateTask = ({ open, onClose, onSave, topicId }) => {
  const [newTask, setNewTask] = useState({
    titulo: '',
    descripcion: '',
    fecha_entrega: new Date(),
    estado: 'pendiente',
    tema: topicId
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask({
      ...newTask,
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

  const handleDateChange = (date) => {
    setNewTask({
      ...newTask,
      fecha_entrega: date
    });
    
    // Clear error when date is edited
    if (errors.fecha_entrega) {
      setErrors({
        ...errors,
        fecha_entrega: null
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!newTask.titulo) newErrors.titulo = 'El título es requerido';
    if (!newTask.descripcion) newErrors.descripcion = 'La descripción es requerida';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Format date correctly for submission
    const formattedDate = newTask.fecha_entrega ? 
      `${newTask.fecha_entrega.getFullYear()}-${(newTask.fecha_entrega.getMonth() + 1).toString().padStart(2, '0')}-${newTask.fecha_entrega.getDate().toString().padStart(2, '0')}` : 
      null;

    onSave({
      titulo: newTask.titulo.trim(),
      descripcion: newTask.descripcion.trim(),
      fecha_entrega: formattedDate,
      estado: newTask.estado,
      tema: topicId
    });
  };
  
  const handleClose = () => {
    setNewTask({
      titulo: '',
      descripcion: '',
      fecha_entrega: new Date(),
      estado: 'pendiente',
      tema: topicId
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-create-task"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          p: 4,
          width: '500px',
          maxWidth: '90%',
        }}
      >
        <Typography id="modal-create-task" variant="h6" component="h2" gutterBottom>
          Crear Nueva Tarea
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Título"
            name="titulo"
            value={newTask.titulo}
            onChange={handleChange}
            error={!!errors.titulo}
            helperText={errors.titulo}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Descripción"
            name="descripcion"
            value={newTask.descripcion}
            onChange={handleChange}
            error={!!errors.descripcion}
            helperText={errors.descripcion}
            margin="normal"
            multiline
            rows={4}
            required
          />
          
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Fecha de Entrega"
              value={newTask.fecha_entrega}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  error={!!errors.fecha_entrega}
                  helperText={errors.fecha_entrega}
                  required
                />
              )}
            />
          </LocalizationProvider>
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="estado-label">Estado</InputLabel>
            <Select
              labelId="estado-label"
              name="estado"
              value={newTask.estado}
              onChange={handleChange}
              label="Estado"
            >
              <MenuItem value="pendiente">Pendiente</MenuItem>
              <MenuItem value="en_progreso">En Progreso</MenuItem>
              <MenuItem value="completada">Completada</MenuItem>
            </Select>
          </FormControl>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={handleClose}
              sx={{ mr: 1 }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: theme.primary,
                color: theme.text,
                '&:hover': {
                  backgroundColor: theme.hover,
                },
              }}
            >
              Guardar
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalCreateTask;
