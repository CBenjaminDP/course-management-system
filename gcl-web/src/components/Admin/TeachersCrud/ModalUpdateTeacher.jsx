import React, { useState, useEffect } from 'react';
import {
  Box,
  Modal,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ModalUpdateTeacher = ({ open, handleClose, teacher, handleUpdate }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nombre_completo: '',
    email: '',
    rol: 'teacher'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (teacher) {
      setFormData({
        username: teacher.username,
        password: '',
        nombre_completo: teacher.nombre_completo,
        email: teacher.email,
        rol: teacher.rol
      });
    }
  }, [teacher]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.nombre_completo) newErrors.nombre_completo = 'Full name is required';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    handleUpdate(teacher.id, formData);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2
      }}>
        <Typography variant="h6" mb={2}>Update Teacher</Typography>

        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={!!errors.username}
          helperText={errors.username}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Full Name"
          name="nombre_completo"
          value={formData.nombre_completo}
          onChange={handleChange}
          error={!!errors.nombre_completo}
          helperText={errors.nombre_completo}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          margin="normal"
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
            )
          }}
        />

        <TextField
          fullWidth
          label="Role"
          name="rol"
          value={formData.rol}
          onChange={handleChange}
          margin="normal"
          select
          SelectProps={{
            native: true,
          }}
        >
          <option value="teacher">Teacher</option>
          <option value="estudiante">Estudiante</option>
          <option value="admin">Admin</option>
        </TextField>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Update</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalUpdateTeacher;