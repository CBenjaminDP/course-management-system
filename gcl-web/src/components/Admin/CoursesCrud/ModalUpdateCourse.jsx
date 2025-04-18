import React, { useState, useEffect } from 'react';
import {
  Box,
  Modal,
  TextField,
  Button,
  Typography,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Switch,
  FormControlLabel,
  Grid
} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

const ModalUpdateCourse = ({ open, onClose, onUpdate, course }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    profesor: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: true,
    imagen_url: ''
  });
  const [teachers, setTeachers] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = Cookies.get('accessToken');
        const response = await axios.get('http://localhost:8000/usuarios/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTeachers(response.data.filter(user => user.rol === 'teacher'));
      } catch (error) {
        console.error('Error fetching teachers:', error);
      } finally {
        setLoadingTeachers(false);
      }
    };

    if (open) {
      fetchTeachers();
    }
  }, [open]);

  useEffect(() => {
    if (course) {
      setFormData({
        nombre: course.nombre,
        descripcion: course.descripcion,
        profesor: course.profesor?.id || '',
        fecha_inicio: course.fecha_inicio,
        fecha_fin: course.fecha_fin,
        estado: course.estado,
        imagen_url: course.imagen_url || ''
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (e) => {
    setFormData(prev => ({
      ...prev,
      estado: e.target.checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = Cookies.get('accessToken');
      await axios.put(`http://localhost:8000/cursos/actualizar_curso/${course.id}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      // Close modal first
      onClose();
      
      // Then show success message
      await Swal.fire({
        title: 'Éxito',
        text: 'Curso actualizado correctamente',
        icon: 'success'
      });
      
      // Finally trigger refresh
      onUpdate();
    } catch (error) {
      console.error('Error updating course:', error);
      await Swal.fire('Error', 'No se pudo actualizar el curso', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        width: '500px', 
        boxShadow: 24, 
        p: 3 
      }}>
        <Box sx={{ 
          backgroundColor: '#1976d2', 
          color: '#fff', 
          borderRadius: '12px 12px 0 0', 
          p: 2, 
          mb: 2 
        }}>
          <Typography variant="h6">Editar Curso</Typography>
        </Box>
        
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Nombre del Curso"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              fullWidth
              required
            />
            
            <TextField
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
            />
            
            <FormControl fullWidth>
              <InputLabel>Profesor</InputLabel>
              <Select
                name="profesor"
                value={formData.profesor}
                onChange={handleChange}
                label="Profesor"
                disabled={loadingTeachers}
                required
              >
                {teachers.map(teacher => (
                  <MenuItem key={teacher.id} value={teacher.id}>
                    {teacher.username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={6}>
                <TextField
                  label="Fecha de Inicio"
                  type="date"
                  name="fecha_inicio"
                  value={formData.fecha_inicio}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                  inputProps={{
                    min: new Date().toISOString().split('T')[0]
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Fecha de Fin"
                  type="date"
                  name="fecha_fin"
                  value={formData.fecha_fin}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                  inputProps={{
                    min: formData.fecha_inicio || new Date().toISOString().split('T')[0]
                  }}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                Estado:
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.estado}
                    onChange={handleStatusChange}
                    name="estado"
                    color="primary"
                  />
                }
                label={formData.estado ? "Activo" : "Inactivo"}
              />
            </Box>

            <TextField
              label="URL de la imagen"
              name="imagen_url"
              value={formData.imagen_url}
              onChange={handleChange}
              fullWidth
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
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Actualizando...' : 'Actualizar Curso'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalUpdateCourse;