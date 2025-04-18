import React, { useState } from 'react';
import {
  Box,
  Modal,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const ModalCreateTopic = ({ open, onClose, onSave, units }) => {
  const [newTopic, setNewTopic] = useState({
    nombre: '',
    descripcion: '',
    orden: 1,
    unidad: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setNewTopic({
      ...newTopic,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!newTopic.nombre) newErrors.nombre = 'El nombre es requerido';
    if (!newTopic.descripcion) newErrors.descripcion = 'La descripción es requerida';
    if (!newTopic.orden) newErrors.orden = 'El orden es requerido';
    if (!newTopic.unidad) newErrors.unidad = 'La unidad es requerida';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(newTopic);
  };

  const isFormValid = () => {
    return (
      newTopic.nombre && 
      newTopic.descripcion && 
      newTopic.unidad && 
      newTopic.orden
    );
  };

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ backgroundColor: 'white', borderRadius: '12px', width: '500px', boxShadow: 24, p: 3 }}>
        <Box sx={{ backgroundColor: '#1976d2', color: '#fff', borderRadius: '12px 12px 0 0', p: 2, mb: 2 }}>
          <Typography variant="h6">Crear Nuevo Tema</Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Nombre del Tema"
            name="nombre"
            value={newTopic.nombre}
            onChange={handleChange}
            error={!!errors.nombre}
            helperText={errors.nombre}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Descripción"
            name="descripcion"
            value={newTopic.descripcion}
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
              value={newTopic.unidad}
              label="Unidad"
              onChange={handleChange}
              required
            >
              {units.map(unit => (
                <MenuItem key={unit.id} value={unit.id}>
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
            value={newTopic.orden}
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
              Crear
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalCreateTopic;