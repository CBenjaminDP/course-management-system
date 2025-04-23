import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Breadcrumbs,
  Link,
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
} from "@mui/material";
import { ArrowBack, Home, Add, Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import { useAlert } from "../../context/AlertContext"; // Ajusta la ruta según tu estructura

// Paleta de colores basada en el logo (del componente Login)
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
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
  borderRadius: "12px",
  border: "1px solid #eee",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)",
    transform: "translateY(-5px)",
  },
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
  transition: "all 0.3s",
  "&:hover": {
    backgroundColor:
      colortype === "delete"
        ? "rgba(239, 68, 68, 0.1)"
        : "rgba(255, 215, 0, 0.1)",
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

const TasksManager = ({
  courseId,
  courseName,
  unitId,
  unitName,
  topicId,
  topicName,
  onBack,
}) => {
  const [tasks, setTasks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTask, setCurrentTask] = useState({
    titulo: "",
    descripcion: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const { showAlert, showConfirmation } = useAlert();

  useEffect(() => {
    if (topicId) {
      fetchTasks();
    }
  }, [topicId]);

  const fetchTasks = async () => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(
        `http://localhost:8000/tareas/tema/${topicId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      showAlert({
        message: "Error al cargar las tareas. Por favor, intenta nuevamente.",
        severity: "error",
      });
    }
  };

  const handleOpenDialog = (
    task = {
      titulo: "",
      descripcion: "",
    }
  ) => {
    // Al editar, no incluimos la fecha_entrega para no modificarla
    const { fecha_entrega, tipo, ...taskWithoutDateAndType } = task;
    setCurrentTask(taskWithoutDateAndType);
    setIsEditing(!!task.id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask({ ...currentTask, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = Cookies.get("accessToken");

      // Añadir fecha actual al crear una nueva tarea
      const taskData = {
        ...currentTask,
        tema: topicId,
      };

      // Solo al crear una nueva tarea añadimos la fecha actual
      if (!isEditing) {
        taskData.fecha_entrega = new Date().toISOString().split("T")[0];
      }

      if (isEditing) {
        await axios.put(
          `http://localhost:8000/tareas/detalle/${currentTask.id}/`,
          taskData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        showAlert({
          message: "Tarea actualizada exitosamente",
          severity: "success",
        });
      } else {
        await axios.post("http://localhost:8000/tareas/crear/", taskData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showAlert({
          message: "Tarea creada exitosamente",
          severity: "success",
        });
      }

      fetchTasks();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving task:", error);
      showAlert({
        message: `Error al ${isEditing ? "actualizar" : "crear"} la tarea: ${
          error.message
        }`,
        severity: "error",
      });
    }
  };

  const handleDelete = (taskId) => {
    showConfirmation({
      title: "¿Eliminar tarea?",
      message:
        "Esta acción no se puede deshacer. La tarea será eliminada permanentemente.",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      onConfirm: async () => {
        try {
          const token = Cookies.get("accessToken");
          await axios.delete(
            `http://localhost:8000/tareas/eliminar/${taskId}/`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          showAlert({
            message: "Tarea eliminada exitosamente",
            severity: "success",
          });
          fetchTasks();
        } catch (error) {
          console.error("Error deleting task:", error);
          showAlert({
            message: `Error al eliminar la tarea: ${error.message}`,
            severity: "error",
          });
        }
      },
    });
  };

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: 3 }}>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <StyledButton
          startIcon={<ArrowBack />}
          onClick={onBack}
          sx={{ mr: 2 }}
          color="inherit"
        >
          Volver a Temas
        </StyledButton>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              // Volver a inicio
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              color: theme.secondary,
              "&:hover": { color: theme.primary },
            }}
          >
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            Inicio
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              // Tres niveles hacia atrás
            }}
            sx={{
              color: theme.secondary,
              "&:hover": { color: theme.primary },
            }}
          >
            Cursos
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              // Dos niveles hacia atrás
            }}
            sx={{
              color: theme.secondary,
              "&:hover": { color: theme.primary },
            }}
          >
            {courseName}
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onBack();
            }}
            sx={{
              color: theme.secondary,
              "&:hover": { color: theme.primary },
            }}
          >
            {unitName}
          </Link>
          <Typography sx={{ color: theme.text, fontWeight: "500" }}>
            Tareas de {topicName}
          </Typography>
        </Breadcrumbs>
      </Box>

      <Typography
        variant="h4"
        sx={{
          mb: 4,
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
        Tareas del Tema: {topicName}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
        <StyledButton
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Nueva Tarea
        </StyledButton>
      </Box>

      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.accent }}>
              <TableCell sx={{ fontWeight: "600", color: theme.text }}>
                Título
              </TableCell>
              <TableCell sx={{ fontWeight: "600", color: theme.text }}>
                Descripción
              </TableCell>
              <TableCell
                sx={{ fontWeight: "600", color: theme.text, width: "150px" }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TableRow
                  key={task.id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(255, 215, 0, 0.05)",
                    },
                  }}
                >
                  <TableCell sx={{ color: theme.text }}>
                    {task.titulo}
                  </TableCell>
                  <TableCell sx={{ color: theme.secondary }}>
                    {task.descripcion}
                  </TableCell>
                  <TableCell>
                    <StyledIconButton
                      onClick={() => handleOpenDialog(task)}
                      title="Editar"
                      colortype="edit"
                    >
                      <Edit />
                    </StyledIconButton>
                    <StyledIconButton
                      onClick={() => handleDelete(task.id)}
                      title="Eliminar"
                      colortype="delete"
                    >
                      <Delete />
                    </StyledIconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  align="center"
                  sx={{ py: 4, color: theme.secondary }}
                >
                  No hay tareas disponibles para este tema.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

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
          {isEditing ? "Editar Tarea" : "Nueva Tarea"}
        </StyledDialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <StyledTextField
            autoFocus
            margin="dense"
            name="titulo"
            label="Título de la Tarea"
            type="text"
            fullWidth
            value={currentTask.titulo}
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
            rows={4}
            value={currentTask.descripcion}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
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

export default TasksManager;
