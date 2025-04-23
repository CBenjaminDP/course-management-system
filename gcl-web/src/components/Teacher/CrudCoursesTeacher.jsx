import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  styled,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  FolderOpen, // Cambiado de Visibility a FolderOpen
  MenuBook, // Otra opción alternativa
  AccountTree, // Otra opción alternativa
  Launch, // Otra opción alternativa
} from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useAlert } from "../../context/AlertContext"; // Ajusta la ruta según tu estructura

// Paleta de colores basada en el logo
const theme = {
  primary: "#FFD700", // Amarillo/dorado del logo
  secondary: "#4A4A4A", // Gris oscuro para contraste
  accent: "#F5F5F5", // Gris claro para fondos
  text: "#333333", // Casi negro para texto
  white: "#FFFFFF", // Blanco puro
  hover: "#E6C200", // Amarillo más oscuro para hover
  error: "#ef4444", // Color para botones de eliminar
};

// Componentes estilizados
const StyledCard = styled(Card)(() => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)",
  },
}));

const StyledCardMedia = styled(CardMedia)(() => ({
  paddingTop: "56.25%", // 16:9 aspect ratio
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "40%",
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
  },
}));

const StyledCardContent = styled(CardContent)(() => ({
  flexGrow: 1,
  padding: "16px",
}));

const StyledCardActions = styled(CardActions)(() => ({
  padding: "8px 16px 16px",
  justifyContent: "flex-end",
}));

const StyledButton = styled(Button)(({ color }) => ({
  borderRadius: "8px",
  padding: "10px 20px",
  textTransform: "none",
  fontWeight: "600",
  backgroundColor: color === "primary" ? theme.primary : theme.white,
  color: color === "primary" ? theme.text : theme.secondary,
  boxShadow: "none",
  transition: "all 0.3s",
  "&:hover": {
    backgroundColor: color === "primary" ? theme.hover : theme.accent,
    boxShadow:
      color === "primary" ? `0 4px 12px rgba(255, 215, 0, 0.3)` : "none",
  },
}));

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

const StyledIconButton = styled(IconButton)(({ colortype }) => ({
  color: colortype === "delete" ? theme.error : theme.primary,
  backgroundColor:
    colortype === "delete"
      ? "rgba(239, 68, 68, 0.1)"
      : "rgba(255, 215, 0, 0.1)",
  transition: "all 0.3s",
  margin: "0 4px",
  padding: "8px",
  "&:hover": {
    backgroundColor:
      colortype === "delete"
        ? "rgba(239, 68, 68, 0.2)"
        : "rgba(255, 215, 0, 0.2)",
    transform: "scale(1.1)",
  },
}));

const StyledDialogTitle = styled(DialogTitle)(() => ({
  color: theme.text,
  fontWeight: "600",
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "0",
    left: "24px",
    width: "40px",
    height: "2px",
    backgroundColor: theme.primary,
  },
}));

const CrudCoursesTeacher = ({ onViewUnits }) => {
  const [courses, setCourses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCourse, setCurrentCourse] = useState({
    nombre: "",
    descripcion: "",
    imagen_url: "", // Este campo será visible
    fecha_inicio: "", // Campo oculto
    fecha_fin: "", // Campo oculto
    estado: true, // Valor por defecto
  });
  const [isEditing, setIsEditing] = useState(false);
  const [teacherId, setTeacherId] = useState(null);
  const { showAlert, showConfirmation } = useAlert();

  useEffect(() => {
    // Obtener el ID del profesor desde el token
    const token = Cookies.get("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Suponiendo que el token contiene el ID del profesor bajo una propiedad como "id" o "user_id"
        const userId = decoded.user_id || decoded.id || decoded.sub;
        setTeacherId(userId);
      } catch (error) {
        console.error("Error decodificando el token:", error);
        showAlert({
          message: "Error al obtener la información del usuario",
          severity: "error",
        });
      }
    }
  }, []);

  useEffect(() => {
    if (teacherId) {
      fetchCourses();
    }
  }, [teacherId]);

  const fetchCourses = async () => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(
        `http://localhost:8000/cursos/profesor/${teacherId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      showAlert({
        message: "Error al cargar los cursos. Por favor, intenta nuevamente.",
        severity: "error",
      });
    }
  };

  const handleOpenDialog = (
    course = {
      nombre: "",
      descripcion: "",
      imagen_url: "",
      fecha_inicio: "",
      fecha_fin: "",
      estado: true,
    }
  ) => {
    setCurrentCourse(course);
    setIsEditing(!!course.id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCourse({ ...currentCourse, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = Cookies.get("accessToken");

      // Generar la fecha actual en formato YYYY-MM-DD
      const today = new Date().toISOString().split("T")[0];

      // Añadir el ID del profesor y las fechas al curso
      const courseData = {
        ...currentCourse,
        profesor: teacherId,
      };

      // Solo para nuevos cursos, establecer las fechas
      if (!isEditing) {
        courseData.fecha_inicio = today;
        courseData.fecha_fin = today;
        // La imagen_url se mantiene como la ingresada por el usuario
      }

      if (isEditing) {
        await axios.put(
          `http://localhost:8000/cursos/detalle/${currentCourse.id}/`,
          courseData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        showAlert({
          message: "Curso actualizado exitosamente",
          severity: "success",
        });
      } else {
        await axios.post(
          "http://localhost:8000/cursos/registrar_curso/",
          courseData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        showAlert({
          message: "Curso creado exitosamente",
          severity: "success",
        });
      }

      fetchCourses();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving course:", error);
      showAlert({
        message: `Error al ${isEditing ? "actualizar" : "crear"} el curso: ${
          error.message
        }`,
        severity: "error",
      });
    }
  };

  const handleDelete = (courseId) => {
    showConfirmation({
      title: "¿Eliminar curso?",
      message:
        "Esta acción no se puede deshacer. El curso será eliminado permanentemente.",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      onConfirm: async () => {
        try {
          const token = Cookies.get("accessToken");
          await axios.delete(
            `http://localhost:8000/cursos/eliminar_curso/${courseId}/`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          showAlert({
            message: "Curso eliminado exitosamente",
            severity: "success",
          });
          fetchCourses();
        } catch (error) {
          console.error("Error deleting course:", error);
          showAlert({
            message: `Error al eliminar el curso: ${error.message}`,
            severity: "error",
          });
        }
      },
    });
  };

  const handleViewUnits = (courseId, courseName) => {
    onViewUnits(courseId, courseName);
  };

  // Función para obtener una imagen por defecto si no hay URL o la URL está vacía
  const getImageUrl = (url) => {
    if (url && url.trim() !== "") {
      return url;
    }
    return "https://via.placeholder.com/300x150?text=Curso"; // Imagen por defecto
  };

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 4,
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            position: "relative",
            pl: 2,
            "&::before": {
              content: '""',
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "4px",
              backgroundColor: theme.primary,
              borderRadius: "4px",
            },
            color: theme.text,
            fontWeight: "600",
          }}
        >
          Gestión de Cursos
        </Typography>
        <StyledButton
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Curso
        </StyledButton>
      </Box>

      {/* Vista de tarjetas */}
      <Grid container spacing={3}>
        {courses.length > 0 ? (
          courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <StyledCard>
                <StyledCardMedia
                  image={getImageUrl(course.imagen_url)}
                  title={course.nombre}
                />
                <StyledCardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "600",
                      color: theme.text,
                      mb: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {course.nombre}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      height: "4.5em", // Aproximadamente 3 líneas
                    }}
                  >
                    {course.descripcion}
                  </Typography>
                </StyledCardContent>
                <Divider />
                <StyledCardActions>
                  <Tooltip title="Ver unidades del curso">
                    <StyledIconButton
                      onClick={() => handleViewUnits(course.id, course.nombre)}
                      colortype="view"
                      size="small"
                    >
                      <FolderOpen fontSize="small" />
                    </StyledIconButton>
                  </Tooltip>
                  <Tooltip title="Editar curso">
                    <StyledIconButton
                      onClick={() => handleOpenDialog(course)}
                      colortype="edit"
                      size="small"
                    >
                      <Edit fontSize="small" />
                    </StyledIconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar curso">
                    <StyledIconButton
                      onClick={() => handleDelete(course.id)}
                      colortype="delete"
                      size="small"
                    >
                      <Delete fontSize="small" />
                    </StyledIconButton>
                  </Tooltip>
                </StyledCardActions>
              </StyledCard>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
              }}
            >
              <Typography sx={{ color: theme.secondary, mb: 2 }}>
                No hay cursos disponibles. Crea tu primer curso haciendo clic en
                "Nuevo Curso".
              </Typography>
              <StyledButton
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
              >
                Crear primer curso
              </StyledButton>
            </Paper>
          </Grid>
        )}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            p: 1,
          },
        }}
      >
        <StyledDialogTitle>
          {isEditing ? "Editar Curso" : "Nuevo Curso"}
        </StyledDialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <StyledTextField
            autoFocus
            margin="dense"
            name="nombre"
            label="Nombre del Curso"
            type="text"
            fullWidth
            value={currentCourse.nombre}
            onChange={handleInputChange}
            sx={{ mb: 3 }}
          />
          <StyledTextField
            margin="dense"
            name="descripcion"
            label="Descripción"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={currentCourse.descripcion}
            onChange={handleInputChange}
            sx={{ mb: 3 }}
          />
          {/* Campo imagen_url visible */}
          <StyledTextField
            margin="dense"
            name="imagen_url"
            label="URL de la imagen"
            type="text"
            fullWidth
            value={currentCourse.imagen_url || ""}
            onChange={handleInputChange}
            placeholder="https://ejemplo.com/imagen.jpg"
            helperText="Ingresa la URL de una imagen para el curso"
          />
          {/* Campos de fecha ocultos (se establecen automáticamente) */}
          <input
            type="hidden"
            name="fecha_inicio"
            value={currentCourse.fecha_inicio || ""}
          />
          <input
            type="hidden"
            name="fecha_fin"
            value={currentCourse.fecha_fin || ""}
          />
          <input
            type="hidden"
            name="estado"
            value={currentCourse.estado || true}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <StyledButton onClick={handleCloseDialog} color="inherit">
            Cancelar
          </StyledButton>
          <StyledButton onClick={handleSubmit} color="primary">
            Guardar
          </StyledButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CrudCoursesTeacher;
