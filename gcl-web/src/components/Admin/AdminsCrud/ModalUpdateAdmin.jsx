import React, { useState, useEffect } from 'react';
import {
  Box,
  Modal,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Define theme colors to match login
const theme = {
  primary: "#FFD700", // Gold
  secondary: "#4A4A4A",
  text: "#333333",
  hover: "#E6C200",
  background: "#f8f9fa",
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

const ModalUpdateAdmin = ({ open, onClose, onUpdate, admin }) => {
  const [formData, setFormData] = useState({
    username: '',
    nombre_completo: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (admin) {
      setFormData({
        username: admin.username,
        nombre_completo: admin.nombre_completo,
        email: admin.email,
        password: '',
        confirmPassword: '',
      });
    }
  }, [admin]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'El nombre de usuario es requerido';
    if (!formData.nombre_completo) newErrors.nombre_completo = 'El nombre completo es requerido';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Se requiere un correo válido';
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedData = {
      username: formData.username,
      nombre_completo: formData.nombre_completo,
      email: formData.email
    };

    // Solo agregar la contraseña si se proporcionó una nueva
    if (formData.password) {
      updatedData.password = formData.password;
    }

    onUpdate(admin.id, updatedData);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Paper
        elevation={3}
        sx={{
          backgroundColor: "white",
          borderRadius: "16px",
          width: "500px",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.primary,
            color: theme.text,
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Actualizar Administrador
          </Typography>
          <Box
            sx={{
              width: "40px",
              height: "3px",
              backgroundColor: theme.text,
              borderRadius: "2px",
              mt: 1,
            }}
          />
        </Box>

        <Box sx={{ p: 3, pt: 4, backgroundColor: theme.background }}>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <StyledTextField
              fullWidth
              margin="normal"
              label="Nombre de Usuario"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              disabled
              variant="outlined"
            />
            <StyledTextField
              fullWidth
              margin="normal"
              label="Nombre Completo"
              name="nombre_completo"
              value={formData.nombre_completo}
              onChange={handleChange}
              error={!!errors.nombre_completo}
              helperText={errors.nombre_completo}
              variant="outlined"
            />
            <StyledTextField
              fullWidth
              margin="normal"
              label="Correo Electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              variant="outlined"
            />
            <StyledTextField
              fullWidth
              margin="normal"
              label="Nueva Contraseña"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
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
            <StyledTextField
              fullWidth
              margin="normal"
              label="Confirmar Nueva Contraseña"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              variant="outlined"
            />
            <Box
              sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}
            >
              <StyledButton
                variant="outlined"
                onClick={onClose}
                sx={{
                  borderColor: theme.secondary,
                  color: theme.secondary,
                  "&:hover": {
                    borderColor: theme.secondary,
                    backgroundColor: "rgba(74, 74, 74, 0.04)",
                  },
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
                  "&:hover": {
                    backgroundColor: theme.hover,
                    boxShadow: "0 4px 12px rgba(255, 215, 0, 0.3)",
                  },
                }}
              >
                Actualizar
              </StyledButton>
            </Box>
          </form>
        </Box>
      </Paper>
    </Modal>
  );
};

export default ModalUpdateAdmin;