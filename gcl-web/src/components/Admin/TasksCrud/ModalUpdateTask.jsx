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
  MenuItem,
  Grid
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { styled } from '@mui/material/styles';
import { es } from 'date-fns/locale';

// Theme colors
const theme = {
  primary: "#FFD700", // Gold
  secondary: "#4A4A4A",
  text: "#333333",
  hover: "#E6C200",
  background: "#f8f9fa",
};

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: '12px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(4),
  width: '500px',
  maxWidth: '90%',
}));

const ModalUpdateTask = ({ open, onClose, task, onSave }) => {
  const [updatedTask, setUpdatedTask] = useState({
    id: '',
    titulo: '',
    descripcion: '',
    fecha_limite: new Date(),
    estado: 'pendiente',
    tema: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setUpdatedTask({
        id: task.id,
        titulo: task.titulo || '',
        descripcion: task.descripcion || '',
        fecha_limite: task.fecha_limite ? new Date(task.fecha_limite) : new Date(),
        estado: task.estado || 'pendiente',
        tema: task.tema?.id || task.tema || ''
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTask({
      ...updatedTask,
      [name]: value
    });
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleDateChange = (date) => {
    setUpdatedTask({
      ...updatedTask,
      fecha_limite: date
    });
    // Clear error when date is edited
    if (errors.fecha_limite) {
      setErrors({
        ...errors,
        fecha_limite: null
      });
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const validateForm = () => {
    const newErrors = {};
    if (!updatedTask.titulo.trim()) newErrors.titulo = 'El título es requerido';
    if (!updatedTask.descripcion.trim()) newErrors.descripcion = 'La descripción es requerida';
    if (!updatedTask.fecha_limite) newErrors.fecha_limite = 'La fecha límite es requerida';
    if (!updatedTask.estado) newErrors.estado = 'El estado es requerido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(updatedTask);
    }
  };

  if (!task) return null;

  return (
    <StyledModal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-update-task"
    >
      <ModalContent>
        <Typography id="modal-update-task" variant="h6" component="h2" gutterBottom>
          Actualizar Tarea
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título"
                name="titulo"
                value={updatedTask.titulo}
                onChange={handleChange}
                error={!!errors.titulo}
                helperText={errors.titulo}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                name="descripcion"
                value={updatedTask.descripcion}
                onChange={handleChange}
                error={!!errors.descripcion}
                helperText={errors.descripcion}
                margin="normal"
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <DatePicker
                  label="Fecha Límite"
                  value={updatedTask.fecha_limite}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      margin="normal"
                      error={!!errors.fecha_limite}
                      helperText={errors.fecha_limite}
                      required
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" error={!!errors.estado} required>
                <InputLabel id="estado-label">Estado</InputLabel>
                <Select
                  labelId="estado-label"
                  name="estado"
                  value={updatedTask.estado}
                  onChange={handleChange}
                  label="Estado"
                >
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="en_progreso">En Progreso</MenuItem>
                  <MenuItem value="completada">Completada</MenuItem>
                </Select>
                {errors.estado && (
                  <Typography variant="caption" color="error">
                    {errors.estado}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={handleClose}
              sx={{ mr: 1 }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: theme.primary,
                color: theme.text,
                '&:hover': {
                  backgroundColor: theme.hover,
                },
              }}
            >
              Actualizar
            </Button>
          </Box>
        </Box>
      </ModalContent>
    </StyledModal>
  );
};

export default ModalUpdateTask;