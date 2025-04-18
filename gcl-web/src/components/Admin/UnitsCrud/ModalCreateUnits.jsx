import React, { useState, useEffect } from 'react';
import {
  Box,
  Modal,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import { Close } from '@mui/icons-material';
import axios from 'axios';
import Cookies from 'js-cookie';

const ModalCreateUnits = ({ open, onClose, onSave, courseId }) => {
  const [courses, setCourses] = useState([]);
  const [newUnit, setNewUnit] = useState({
    nombre: '',
    curso: courseId || '',
    orden: 1
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = Cookies.get('accessToken');
        const response = await axios.get('http://localhost:8000/cursos/listar_cursos/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setNewUnit({
      ...newUnit,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!newUnit.nombre) newErrors.nombre = 'El nombre es requerido';
    if (!newUnit.curso) newErrors.curso = 'El curso es requerido';
    if (!newUnit.orden) newErrors.orden = 'El orden es requerido';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      nombre: newUnit.nombre,
      curso: newUnit.curso,
      orden: parseInt(newUnit.orden)
    });
    handleClose();
  };

  const handleClose = () => {
    setNewUnit({
      nombre: '',
      curso: courseId || '',
      orden: 1
    });
    setErrors({});
    onClose();
  };

  const isFormValid = () => {
    return newUnit.nombre && newUnit.curso && newUnit.orden;
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
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
          <Typography variant="h6">Crear Nueva Unidad</Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Nombre de la Unidad"
            name="nombre"
            value={newUnit.nombre}
            onChange={handleChange}
            error={!!errors.nombre}
            helperText={errors.nombre}
          />

          <FormControl fullWidth margin="normal" error={!!errors.curso}>
            <InputLabel>Curso</InputLabel>
            <Select
              name="curso"
              value={newUnit.curso}
              label="Curso"
              onChange={handleChange}
            >
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.nombre}
                </MenuItem>
              ))}
            </Select>
            {errors.curso && <Typography color="error" variant="caption">{errors.curso}</Typography>}
          </FormControl>

          <FormControl fullWidth margin="normal" error={!!errors.orden}>
            <InputLabel>Orden</InputLabel>
            <Select
              name="orden"
              value={newUnit.orden}
              label="Orden"
              onChange={handleChange}
              renderValue={(selected) => selected}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200
                  }
                }
              }}
            >
              <MenuItem value="">
                <em>Seleccionar o escribir</em>
              </MenuItem>
              {[...Array(20).keys()].map((i) => (
                <MenuItem key={i+1} value={i+1}>
                  {i+1}
                </MenuItem>
              ))}
            </Select>
            {errors.orden && <Typography color="error" variant="caption">{errors.orden}</Typography>}
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="O escribe el número de orden"
            type="number"
            name="orden"
            value={newUnit.orden}
            onChange={handleChange}
            inputProps={{ min: 1 }}
            sx={{ mt: 1 }}
          />

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={handleClose}
              sx={{ borderRadius: '20px' }}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={!isFormValid()}
              sx={{ borderRadius: '20px' }}
            >
              Guardar
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalCreateUnits;