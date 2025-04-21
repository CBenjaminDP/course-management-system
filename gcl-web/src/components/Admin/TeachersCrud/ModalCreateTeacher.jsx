import React, { useState } from "react";
import {
  Box,
  Modal,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { styled } from '@mui/material/styles';

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
  borderRadius: "8px",
  padding: "10px 20px",
  textTransform: "none",
  fontWeight: "600",
  boxShadow: "none",
  transition: "all 0.3s",
}));

const ModalCreateTeacher = ({ open, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    nombre_completo: "",
    email: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación básica
    const newErrors = {};
    if (!formData.nombre_completo)
      newErrors.nombre_completo = "El nombre completo es requerido";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Se requiere un correo válido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newTeacher = {
      nombre_completo: formData.nombre_completo,
      email: formData.email,
      rol: "teacher",
    };

    const success = await onCreate(newTeacher);
    if (success) {
      setFormData({
        nombre_completo: "",
        email: "",
      });
      setErrors({});
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Paper
        elevation={3}
        sx={{
          backgroundColor: 'white',
          borderRadius: '16px',
          width: '500px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.primary,
            color: theme.text,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Crear Nuevo Profesor
          </Typography>
          <Box
            sx={{
              width: '40px',
              height: '3px',
              backgroundColor: theme.text,
              borderRadius: '2px',
              mt: 1
            }}
          />
        </Box>
        
        <Box sx={{ p: 3, pt: 4, backgroundColor: theme.background }}>
          <form onSubmit={handleSubmit}>
            <StyledTextField
              fullWidth
              label="Nombre Completo"
              name="nombre_completo"
              value={formData.nombre_completo}
              onChange={handleChange}
              error={!!errors.nombre_completo}
              helperText={errors.nombre_completo}
              margin="normal"
              variant="outlined"
            />

            <StyledTextField
              fullWidth
              label="Correo Electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
              variant="outlined"
            />

            <Typography variant="body2" sx={{ mt: 2, color: theme.secondary }}>
              El nombre de usuario y la contraseña se generarán automáticamente y se enviarán al correo electrónico proporcionado.
            </Typography>

            <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
              <StyledButton
                variant="outlined"
                onClick={onClose}
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
                sx={{ 
                  backgroundColor: theme.primary,
                  color: theme.text,
                  '&:hover': {
                    backgroundColor: theme.hover,
                    boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)'
                  }
                }}
              >
                Crear
              </StyledButton>
            </Box>
          </form>
        </Box>
      </Paper>
    </Modal>
  );
};

export default ModalCreateTeacher;
