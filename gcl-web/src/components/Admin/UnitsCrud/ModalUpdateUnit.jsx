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
import { styled } from '@mui/material/styles';
import { useAlert } from "../../../context/AlertContext"; // Import useAlert hook

// Define theme colors to match login
const theme = {
  primary: "#FFD700", // Gold
  secondary: "#4A4A4A",
  text: "#333333",
  hover: "#E6C200",
  background: "#f8f9fa"
};

// Styled components for form elements
const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    transition: "all 0.3s",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.primary,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.primary,
      borderWidth: "1px",
    },
  },
  "& .MuiFormLabel-root.Mui-focused": {
    color: theme.secondary,
  },
}));

const StyledButton = styled(Button)(() => ({
  borderRadius: "20px",
  padding: "10px 20px",
  textTransform: "none",
  fontWeight: "600",
  boxShadow: "none",
  transition: "all 0.3s",
}));

const ModalUpdateUnit = ({ open, onClose, unit, onSave }) => {
  const [courses, setCourses] = useState([]);
  const [updatedUnit, setUpdatedUnit] = useState({
    nombre: '',
    curso: '',
    orden: 1
  });
  const [errors, setErrors] = useState({});
  const { showAlert } = useAlert(); // Use the alert context

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
        showAlert({
          message: "Error al cargar los cursos",
          severity: "error",
        });
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

    onSave(updateData);
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
            backgroundColor: theme.primary,
            color: theme.text,
            borderRadius: '12px 12px 0 0',
            p: 2,
            mb: 2
          }}
        >
          <Typography variant="h6">Actualizar Unidad</Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <StyledTextField
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
              sx={{
                borderRadius: "8px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0, 0, 0, 0.23)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.primary,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.primary,
                }
              }}
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
              sx={{
                borderRadius: "8px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0, 0, 0, 0.23)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.primary,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.primary,
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
            <StyledButton 
              variant="outlined" 
              onClick={handleClose}
              sx={{ 
                borderColor: theme.secondary,
                color: theme.secondary,
                '&:hover': {
                  borderColor: theme.secondary,
                  backgroundColor: 'rgba(74, 74, 74, 0.04)'
                }
              }}
            >
              Cancelar
            </StyledButton>
            <StyledButton 
              type="submit" 
              variant="contained" 
              disabled={!isFormValid()}
              sx={{ 
                backgroundColor: theme.primary,
                color: theme.text,
                '&:hover': {
                  backgroundColor: theme.hover
                },
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(255, 215, 0, 0.5)',
                  color: 'rgba(51, 51, 51, 0.7)'
                }
              }}
            >
              Actualizar
            </StyledButton>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalUpdateUnit;