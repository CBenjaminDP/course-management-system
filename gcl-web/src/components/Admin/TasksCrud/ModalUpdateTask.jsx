import React, { useState, useEffect } from 'react';
import {
  Modal, Typography, TextField, Button, Box,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import Cookies from 'js-cookie';

const ModalUpdateTask = ({ open, onClose, task, onSave }) => {
  const [updatedTask, setUpdatedTask] = useState({
    titulo: '',
    descripcion: '',
    fecha_entrega: null,
    tema: ''
  });
  const [topics, setTopics] = useState([]);
  const [errors, setErrors] = useState({});

  // Load topics when modal opens
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const token = Cookies.get('accessToken');
        const response = await axios.get('http://localhost:8000/temas/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTopics(response.data);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    if (open) {
      fetchTopics();
    }
  }, [open]);

  // Update form when task changes
  useEffect(() => {
    if (task && open && topics.length > 0) {
      console.log('Task data received:', task);
      // Find the topic that matches the task.tema name
      const matchingTopic = topics.find(t => t.nombre === task.tema);
      
      // Fix date handling
      let fechaEntrega = null;
      if (task.fecha_entrega) {
        // Parse the date string and add a day to compensate for timezone offset
        const dateParts = task.fecha_entrega.split('-');
        fechaEntrega = new Date(
          parseInt(dateParts[0]),
          parseInt(dateParts[1]) - 1, // Months are 0-based
          parseInt(dateParts[2])
        );
      }

      setUpdatedTask({
        id: task.id,
        titulo: task.titulo,
        descripcion: task.descripcion,
        fecha_entrega: fechaEntrega,
        tema: matchingTopic ? matchingTopic.id : ''
      });
    }
  }, [task, open, topics]); // Add topics to dependencies

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTask({
      ...updatedTask,
      [name]: value
    });
  };

  const handleDateChange = (date) => {
    setUpdatedTask({
      ...updatedTask,
      fecha_entrega: date
    });
  };

  // Modify the date formatting in handleSubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!updatedTask.titulo) newErrors.titulo = 'El título es requerido';
    if (!updatedTask.descripcion) newErrors.descripcion = 'La descripción es requerida';
    if (!updatedTask.tema) newErrors.tema = 'El tema es requerido';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Format date correctly for submission
    const formattedDate = updatedTask.fecha_entrega ? 
      `${updatedTask.fecha_entrega.getFullYear()}-${(updatedTask.fecha_entrega.getMonth() + 1).toString().padStart(2, '0')}-${updatedTask.fecha_entrega.getDate().toString().padStart(2, '0')}` : 
      null;

    onSave({
      titulo: updatedTask.titulo.trim(),
      descripcion: updatedTask.descripcion.trim(),
      fecha_entrega: formattedDate,
      tema: updatedTask.tema,
      id: task.id
    });
  };

  const isFormValid = () => {
    return (
      updatedTask.titulo && 
      updatedTask.descripcion && 
      updatedTask.tema
    );
  };

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ backgroundColor: 'white', borderRadius: '12px', width: '500px', boxShadow: 24, p: 3 }}>
        <Box sx={{ backgroundColor: '#1976d2', color: '#fff', borderRadius: '12px 12px 0 0', p: 2, mb: 2 }}>
          <Typography variant="h6">Editar Tarea</Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Título"
            name="titulo"
            value={updatedTask.titulo}
            onChange={handleChange}
            error={!!errors.titulo}
            helperText={errors.titulo}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Descripción"
            name="descripcion"
            value={updatedTask.descripcion}
            onChange={handleChange}
            error={!!errors.descripcion}
            helperText={errors.descripcion}
            multiline
            rows={4}
          />

          <FormControl fullWidth margin="normal" error={!!errors.tema}>
            <InputLabel>Tema</InputLabel>
            <Select
              name="tema"
              value={updatedTask.tema || ''}
              label="Tema"
              onChange={handleChange}
              required
            >
              {topics.map(topic => (
                <MenuItem key={topic.id} value={topic.id}>
                  {topic.nombre}
                </MenuItem>
              ))}
            </Select>
            {errors.tema && <Typography color="error" variant="caption">{errors.tema}</Typography>}
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Fecha de Entrega"
              value={updatedTask.fecha_entrega}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  fullWidth 
                  margin="normal"
                />
              )}
            />
          </LocalizationProvider>

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

export default ModalUpdateTask;