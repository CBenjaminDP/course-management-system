import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Switch,
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

const ModalUpdateStudent = ({ open, onClose, onUpdate, student }) => {
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState({
    username: "",
    nombre_completo: "",
    email: "",
    password: "",
    confirmPassword: "",
    is_active: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        username: student.username || "",
        nombre_completo: student.nombre_completo || "",
        email: student.email || "",
        password: "",
        confirmPassword: "",
        is_active: student.is_active !== undefined ? student.is_active : true,
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    // Validación básica
    const newErrors = {};
    if (!formData.nombre_completo)
      newErrors.nombre_completo = "El nombre completo es requerido";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Se requiere un correo válido";
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedData = {
      nombre_completo: formData.nombre_completo,
      email: formData.email,
      is_active: formData.is_active,
    };

    // Solo agregar la contraseña si se proporcionó una nueva
    if (formData.password) {
      updatedData.password = formData.password;
    }

    onUpdate(student.id, updatedData);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
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
          <Typography variant="h6">Actualizar Estudiante</Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Nombre de Usuario"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: theme.primary,
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: theme.primary,
              },
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Nombre Completo"
            name="nombre_completo"
            value={formData.nombre_completo}
            onChange={handleChange}
            error={!!errors.nombre_completo}
            helperText={errors.nombre_completo}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: theme.primary,
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: theme.primary,
              },
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Correo Electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: theme.primary,
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: theme.primary,
              },
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Nueva Contraseña"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: theme.primary,
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: theme.primary,
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Confirmar Nueva Contraseña"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: theme.primary,
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: theme.primary,
              },
            }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.is_active}
                onChange={handleChange}
                name="is_active"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: theme.primary,
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: theme.primary,
                  },
                }}
              />
            }
            label="Usuario Activo"
            sx={{ mt: 2 }}
          />
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={onClose}
              sx={{ 
                borderRadius: '20px',
                borderColor: theme.primary,
                color: theme.text,
                '&:hover': {
                  borderColor: theme.hover,
                  backgroundColor: 'rgba(255, 215, 0, 0.04)',
                }
              }}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              sx={{ 
                borderRadius: '20px',
                backgroundColor: theme.primary,
                color: theme.text,
                '&:hover': {
                  backgroundColor: theme.hover,
                }
              }}
            >
              Actualizar
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalUpdateStudent;
