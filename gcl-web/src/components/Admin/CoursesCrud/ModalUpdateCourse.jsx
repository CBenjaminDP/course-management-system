import React, { useState, useEffect } from "react";
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
  Grid,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useAlert } from "../../../context/AlertContext"; // Import the alert context
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

const ModalUpdateCourse = ({ open, onClose, onUpdate, course, rol, id }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    profesor: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado: true,
    imagen_url: "",
  });
  const [teachers, setTeachers] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showAlert } = useAlert(); // Use the alert context

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = Cookies.get("accessToken");
        const response = await axios.get("http://localhost:8000/usuarios/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTeachers(response.data.filter((user) => user.rol === "teacher"));
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setLoadingTeachers(false);
      }
    };

    if (open && rol === "teacher") {
      setFormData((prev) => ({ ...prev, profesor: id }));
      fetchTeachers();
    } else {
      setFormData((prev) => ({ ...prev, profesor: "" }));
      fetchTeachers();
    }
  }, [open]);

  useEffect(() => {
    if (course) {
      setFormData({
        nombre: course.nombre,
        descripcion: course.descripcion,
        profesor: course.profesor?.id || "",
        fecha_inicio: course.fecha_inicio,
        fecha_fin: course.fecha_fin,
        estado: course.estado,
        imagen_url: course.imagen_url || "",
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      estado: e.target.checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = Cookies.get("accessToken");
      await axios.put(
        `http://localhost:8000/cursos/actualizar_curso/${course.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Close modal first
      onClose();

      // Then show success message using alert context
      showAlert({
        message: "Curso actualizado correctamente",
        severity: "success",
      });

      // Finally trigger refresh
      onUpdate();
    } catch (error) {
      console.error("Error updating course:", error);
      showAlert({
        message: "No se pudo actualizar el curso",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
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
          <Typography variant="h6">Editar Curso</Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <StyledTextField
              label="Nombre del Curso"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              fullWidth
              required
            />

            <StyledTextField
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
            />

            {rol !== "teacher" && (
              <FormControl fullWidth>
                <InputLabel>Profesor</InputLabel>
                <Select
                  name="profesor"
                  value={formData.profesor}
                  onChange={handleChange}
                  label="Profesor"
                  disabled={loadingTeachers}
                  required
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
                  {teachers.map((teacher) => (
                    <MenuItem key={teacher.id} value={teacher.id}>
                      {teacher.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Cambia la fecha de inicio para que ocupe todo el ancho */}
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
                min: new Date().toISOString().split("T")[0],
              }}
            />

            <Box sx={{ display: "flex", alignItems: "center" }}>
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

            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <StyledButton
                variant="outlined"
                onClick={onClose}
                sx={{
                  borderRadius: "20px",
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
                  borderRadius: "20px",
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
                disabled={isSubmitting}
              >
                {isSubmitting ? "Actualizando..." : "Actualizar Curso"}
              </StyledButton>
            </Box>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalUpdateCourse;
