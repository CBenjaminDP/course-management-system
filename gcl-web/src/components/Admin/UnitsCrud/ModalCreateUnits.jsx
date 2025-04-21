import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { styled } from "@mui/material/styles";
import { useAlert } from "../../../context/AlertContext"; // Import useAlert hook

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
  borderRadius: "20px",
  padding: "10px 20px",
  textTransform: "none",
  fontWeight: "600",
  boxShadow: "none",
  transition: "all 0.3s",
}));

const ModalCreateUnits = ({ open, onClose, onSave, courseId }) => {
  const [courses, setCourses] = useState([]);
  const [newUnit, setNewUnit] = useState({
    nombre: "",
    curso: courseId || "",
    orden: 1,
  });
  const [errors, setErrors] = useState({});
  const { showAlert } = useAlert(); // Use the alert context

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = Cookies.get("accessToken");
        const response = await axios.get(
          "http://localhost:8000/cursos/listar_cursos/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        showAlert({
          message: "Error al cargar los cursos",
          severity: "error",
        });
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (courseId) {
      setNewUnit((prev) => ({
        ...prev,
        curso: courseId,
      }));
    }
  }, [courseId]);

  const handleChange = (e) => {
    setNewUnit({
      ...newUnit,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!newUnit.nombre) newErrors.nombre = "El nombre es requerido";
    if (!newUnit.curso) newErrors.curso = "El curso es requerido";
    if (!newUnit.orden) newErrors.orden = "El orden es requerido";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      nombre: newUnit.nombre,
      curso: newUnit.curso,
      orden: parseInt(newUnit.orden),
    });
    handleClose();
  };

  const handleClose = () => {
    setNewUnit({
      nombre: "",
      curso: courseId || "",
      orden: 1,
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
          <Typography variant="h6">Crear Nueva Unidad</Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <StyledTextField
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
                },
              }}
            >
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.nombre}
                </MenuItem>
              ))}
            </Select>
            {errors.curso && (
              <Typography color="error" variant="caption">
                {errors.curso}
              </Typography>
            )}
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
                    maxHeight: 200,
                  },
                },
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
                },
              }}
            >
              <MenuItem value="">
                <em>Seleccionar o escribir</em>
              </MenuItem>
              {[...Array(20).keys()].map((i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {i + 1}
                </MenuItem>
              ))}
            </Select>
            {errors.orden && (
              <Typography color="error" variant="caption">
                {errors.orden}
              </Typography>
            )}
          </FormControl>

          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <StyledButton
              variant="outlined"
              onClick={handleClose}
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
              disabled={!isFormValid()}
              sx={{
                backgroundColor: theme.primary,
                color: theme.text,
                "&:hover": {
                  backgroundColor: theme.hover,
                },
                "&.Mui-disabled": {
                  backgroundColor: "rgba(255, 215, 0, 0.5)",
                  color: "rgba(51, 51, 51, 0.7)",
                },
              }}
            >
              Guardar
            </StyledButton>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalCreateUnits;
