import React, { useState, useEffect } from 'react';
import { Box, Modal, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ModalUpdateTopic = ({ open, onClose, topic, onSave, units }) => {
  const [updatedTopic, setUpdatedTopic] = useState({
    nombre: '',
    descripcion: '',
    orden: 1,
    unidad: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (topic) {
      console.log('Topic data received:', topic);
      setUpdatedTopic({
        nombre: topic.nombre,
        descripcion: topic.descripcion,
        orden: topic.orden,
        unidad: topic.unidad // Use the exact unidad from the topic
      });
    }
  }, [topic]);

  const handleChange = (e) => {
    setUpdatedTopic({
      ...updatedTopic,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!updatedTopic.nombre) newErrors.nombre = 'El nombre es requerido';
    if (!updatedTopic.descripcion) newErrors.descripcion = 'La descripción es requerida';
    if (!updatedTopic.orden) newErrors.orden = 'El orden es requerido';
    if (!updatedTopic.unidad) newErrors.unidad = 'La unidad es requerida';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...updatedTopic,
      id: topic.id
    });
  };

  const isFormValid = () => {
    return (
      updatedTopic.nombre && 
      updatedTopic.descripcion && 
      updatedTopic.unidad && 
      updatedTopic.orden
    );
  };

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ backgroundColor: 'white', borderRadius: '12px', width: '500px', boxShadow: 24, p: 3 }}>
        <Box sx={{ backgroundColor: '#1976d2', color: '#fff', borderRadius: '12px 12px 0 0', p: 2, mb: 2 }}>
          <Typography variant="h6">Actualizar Tema</Typography>
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
          />

          <FormControl fullWidth margin="normal" error={!!errors.unidad}>
            <InputLabel>Unidad</InputLabel>
            <Select
              name="unidad"
              value={updatedTopic.unidad}
              label="Unidad"
              onChange={handleChange}
              required
            >
              {units.map(unit => (
                <MenuItem key={unit.id} value={unit.nombre}>  {/* Changed from unit.id to unit.nombre */}
                  {unit.nombre}
                </MenuItem>
              ))}
            </Select>
            {errors.unidad && <Typography color="error" variant="caption">{errors.unidad}</Typography>}
          </FormControl>

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
            inputProps={{ min: 1 }}
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