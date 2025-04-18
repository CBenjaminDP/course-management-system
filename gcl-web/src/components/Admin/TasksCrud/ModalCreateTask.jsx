import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, CircularProgress, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import Cookies from 'js-cookie';
import { 
  Modal, 
  Typography 
} from '@mui/material';

const ModalCreateTask = ({ open, onClose, onSave, topicId }) => {
  const [newTask, setNewTask] = useState({
    titulo: '',
    descripcion: '',
    fecha_entrega: null,
    tema: topicId
  });
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleDateChange = (date) => {
    setNewTask({ ...newTask, fecha_entrega: date });
  };

  const handleSubmit = () => {
    // Format the date to YYYY-MM-DD only
    const formattedDate = newTask.fecha_entrega ? 
      new Date(newTask.fecha_entrega).toISOString().split('T')[0] : 
      null;

    const taskToSubmit = {
      titulo: newTask.titulo.trim(),
      descripcion: newTask.descripcion.trim(),
      fecha_entrega: formattedDate, // Now in YYYY-MM-DD format
      tema: newTask.tema
    };

    // Validate required fields
    if (!taskToSubmit.titulo || !taskToSubmit.tema) {
      Swal.fire('Error', 'Título y Tema son campos requeridos', 'error');
      return;
    }

    onSave(taskToSubmit);
  };

  if (loading) return <CircularProgress />;

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        width: '500px', 
        boxShadow: 24, 
        p: 3 
      }}>
        {/* Header with blue background */}
        <Box sx={{ 
          backgroundColor: '#1976d2', 
          color: '#fff', 
          borderRadius: '12px 12px 0 0', 
          p: 2, 
          mb: 2 
        }}>
          <Typography variant="h6">Crear Nueva Tarea</Typography>
        </Box>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <TextField
            fullWidth
            margin="normal"
            label="Título"
            name="titulo"
            value={newTask.titulo}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Descripción"
            name="descripcion"
            value={newTask.descripcion}
            onChange={handleChange}
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Tema</InputLabel>
            <Select
              name="tema"
              value={newTask.tema}
              label="Tema"
              onChange={handleChange}
            >
              {topics.map(topic => (
                <MenuItem key={topic.id} value={topic.id}>
                  {topic.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
                  sx={{ mb: 2 }}
                />
              )}
            />
          </LocalizationProvider>

          <Box sx={{ 
            mt: 3, 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: 2 
          }}>
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
              Crear
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalCreateTask;