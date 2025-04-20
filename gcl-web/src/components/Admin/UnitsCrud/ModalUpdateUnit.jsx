import React, { useState, useEffect } from 'react';
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
import axios from 'axios';
import Cookies from 'js-cookie';

const ModalUpdateUnit = ({ open, onClose, unit, onSave }) => {
  const [courses, setCourses] = useState([]);
  const [updatedUnit, setUpdatedUnit] = useState({
    nombre: '',
    curso: '',
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
    if (unit) {
      setUpdatedUnit({
        nombre: unit.nombre,
        curso: unit.curso.id,
        orden: unit.orden
      });
    }
  }, [unit]);

  const handleChange = (e) => {
    setUpdatedUnit({
      ...updatedUnit,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!updatedUnit.nombre) newErrors.nombre = 'El nombre es requerido';
    if (!updatedUnit.curso) newErrors.curso = 'El curso es requerido';
    if (!updatedUnit.orden) newErrors.orden = 'El orden es requerido';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Include the original unit ID in the update data
    const updateData = {
      ...updatedUnit,
      id: unit.id // Preserve the original ID
    };

    try {
      const token = Cookies.get('accessToken');
      await axios.put(
        `http://localhost:8000/unidades/actualizar/${unit.id}/`,
        updateData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      onSave(updateData); // Pass the complete update data
      handleClose();
    } catch (error) {
      console.error('Error updating unit:', error);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const isFormValid = () => {
    return updatedUnit.nombre && updatedUnit.curso && updatedUnit.orden;
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
          <Typography variant="h6">Actualizar Unidad</Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Nombre de la Unidad"
            name="nombre"
            value={updatedUnit.nombre}
            onChange={handleChange}
            error={!!errors.nombre}
            helperText={errors.nombre}
          />

          <FormControl fullWidth margin="normal" error={!!errors.curso}>
            <InputLabel>Curso</InputLabel>
            <Select
              name="curso"
              value={updatedUnit.curso}
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
              value={updatedUnit.orden}
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
              {[...Array(20).keys()].map((i) => (
                <MenuItem key={i+1} value={i+1}>
                  {i+1}
                </MenuItem>
              ))}
            </Select>
            {errors.orden && <Typography color="error" variant="caption">{errors.orden}</Typography>}
          </FormControl>

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
              Actualizar
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalUpdateUnit;