import React, { useState } from "react";
import {
  Box,
  Modal,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAlert } from "../../../context/AlertContext";

// Update theme colors to match teacher components
const theme = {
  primary: "#FFD700", // Gold
  secondary: "#4A4A4A",
  text: "#333333",
  hover: "#E6C200",
  background: "#f5f5f5",
};

const ModalCreateStudent = ({ open, onClose, onCreate }) => {
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState({
    nombre_completo: "",
    email: "",
  });
  const [showPassword, setShowPassword] = useState(false);
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

    // Crear objeto de estudiante (solo con los campos necesarios)
    const newStudent = {
      nombre_completo: formData.nombre_completo,
      email: formData.email,
      rol: "student",
    };

    // Intentar crear el estudiante
    const success = await onCreate(newStudent);
    if (success) {
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      nombre_completo: "",
      email: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "12px",
          width: "500px",
          boxShadow: 24,
          p: 3,
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.primary,
            color: theme.text,
            borderRadius: "12px 12px 0 0",
            p: 2,
            mb: 2,
          }}
        >
          <Typography variant="h6">Crear Nuevo Estudiante</Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre Completo"
            name="nombre_completo"
            value={formData.nombre_completo}
            onChange={handleChange}
            error={!!errors.nombre_completo}
            helperText={errors.nombre_completo}
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: theme.primary,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: theme.primary,
              },
            }}
          />

          <TextField
            fullWidth
            label="Correo Electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: theme.primary,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: theme.primary,
              },
            }}
          />

          <Typography variant="body2" sx={{ mt: 2, color: theme.secondary }}>
            El nombre de usuario y la contraseña se generarán automáticamente y
            se enviarán al correo electrónico proporcionado.
          </Typography>

          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{
                borderRadius: "20px",
                borderColor: theme.primary,
                color: theme.text,
                "&:hover": {
                  borderColor: theme.hover,
                  backgroundColor: "rgba(255, 215, 0, 0.04)",
                },
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                borderRadius: "20px",
                backgroundColor: theme.primary,
                color: theme.text,
                "&:hover": {
                  backgroundColor: theme.hover,
                },
              }}
            >
              Crear
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalCreateStudent;
