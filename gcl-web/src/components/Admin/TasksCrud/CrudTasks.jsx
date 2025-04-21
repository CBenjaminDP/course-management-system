import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box, Button, Card, CardHeader, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, CircularProgress, IconButton, Typography, Chip
} from '@mui/material';
import { Add, Edit, Delete, Refresh, Description } from '@mui/icons-material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { tableStyles } from '../../../styles/tableStyles';
import ModalCreateTask from './ModalCreateTask';
import ModalUpdateTask from './ModalUpdateTask';
import { useAlert } from '../../../context/AlertContext';

// Theme colors to match gold theme
const theme = {
  primary: "#FFD700", // Gold
  secondary: "#4A4A4A",
  text: "#333333",
  hover: "#E6C200",
  background: "#f8f9fa",
};

const styles = {
  card: {
    margin: '24px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    borderRadius: '12px'
  },
  embeddedCard: {
    boxShadow: "none",
    margin: 0,
  },
  header: {
    backgroundColor: theme.primary,
    color: theme.secondary,
    borderRadius: '12px 12px 0 0'
  },
  embeddedHeader: {
    backgroundColor: "transparent",
    color: theme.secondary,
    padding: "16px 0",
  },
  addButton: {
    margin: '16px',
    backgroundColor: theme.primary,
    color: theme.text,
    borderRadius: '20px',
    padding: '8px 24px',
    '&:hover': {
      backgroundColor: theme.hover,
      boxShadow: "0 4px 12px rgba(255, 215, 0, 0.3)",
    }
  },
  refreshButton: {
    margin: '0 8px',
    backgroundColor: theme.secondary,
    color: '#ffffff',
    borderRadius: '20px',
    '&:hover': {
      backgroundColor: '#333333',
      transform: 'rotate(180deg)',
      transition: 'transform 0.5s'
    }
  },
  statusChip: {
    borderRadius: '16px',
    fontWeight: 'bold',
    padding: '0 10px'
  }
};

const CrudTasks = ({ topicId: propsTopicId, embedded = false }) => {
  const router = useRouter();
  const { topicId: routerTopicId } = router.query;
  const topicId = propsTopicId || routerTopicId;
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const { showAlert, showConfirmation } = useAlert();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('accessToken');

      if (!topicId) {
        console.log("No topicId available, skipping fetch");
        setTasks([]);
        setLoading(false);
        return;
      }

      console.log("Fetching tasks for topic:", topicId);
      // Get all tasks
      const response = await axios.get(`http://localhost:8000/tareas/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("All tasks response:", response.data);

      // Convert topicId to string to ensure consistent comparison
      const topicIdStr = String(topicId);

      // Filter tasks by topicId on the client side
      const filteredTasks = Array.isArray(response.data)
        ? response.data.filter((task) => {
            return task.tema && String(task.tema.id) === topicIdStr;
          })
        : [];

      console.log("Filtered tasks for topic:", filteredTasks);
      setTasks(filteredTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      if (error.response?.status === 401) {
        showAlert({
          message: "Sesión expirada. Por favor inicie sesión nuevamente.",
          severity: "error",
        });
        router.push("/login");
      } else {
        showAlert({
          message: "No se pudieron cargar las tareas: " + (error.message || "Error desconocido"),
          severity: "error",
        });
      }
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (topicId) {
      console.log("topicId changed, fetching tasks");
      fetchTasks();
    } else {
      console.log("No topicId yet");
      setLoading(false);
    }
  }, [topicId]);

  const handleCreateTask = async (taskData) => {
    try {
      const token = Cookies.get('accessToken');
      await axios.post('http://localhost:8000/tareas/registrar/', 
        { ...taskData, tema: topicId },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      showAlert({
        message: "Tarea creada correctamente",
        severity: "success",
      });
      fetchTasks();
      setOpenCreateModal(false);
    } catch (error) {
      console.error('Error creating task:', error);
      showAlert({
        message: "No se pudo crear la tarea",
        severity: "error",
      });
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const token = Cookies.get('accessToken');
      await axios.put(`http://localhost:8000/tareas/actualizar/${updatedTask.id}/`, 
        updatedTask,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      showAlert({
        message: "Tarea actualizada correctamente",
        severity: "success",
      });
      fetchTasks();
      setOpenEditModal(false);
    } catch (error) {
      console.error('Error updating task:', error);
      showAlert({
        message: "No se pudo actualizar la tarea",
        severity: "error",
      });
    }
  };

  const handleDeleteTask = (taskId) => {
    showConfirmation({
      title: "¿Estás seguro?",
      message: "¡No podrás revertir esta acción!",
      onConfirm: async () => {
        try {
          const token = Cookies.get('accessToken');
          await axios.delete(`http://localhost:8000/tareas/eliminar/${taskId}/`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          showAlert({
            message: "Tarea eliminada correctamente",
            severity: "success",
          });
          fetchTasks();
        } catch (error) {
          console.error('Error deleting task:', error);
          showAlert({
            message: "No se pudo eliminar la tarea",
            severity: "error",
          });
        }
      }
    });
  };

  const getStatusChipProps = (status) => {
    switch(status) {
      case 'pendiente':
        return { 
          label: 'Pendiente', 
          sx: { ...styles.statusChip, backgroundColor: '#ffcc80', color: '#e65100' } 
        };
      case 'en_progreso':
        return { 
          label: 'En Progreso', 
          sx: { ...styles.statusChip, backgroundColor: '#90caf9', color: '#0d47a1' } 
        };
      case 'completada':
        return { 
          label: 'Completada', 
          sx: { ...styles.statusChip, backgroundColor: '#a5d6a7', color: '#1b5e20' } 
        };
      default:
        return { 
          label: status, 
          sx: { ...styles.statusChip, backgroundColor: '#e0e0e0', color: '#616161' } 
        };
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card sx={embedded ? styles.embeddedCard : styles.card}>
      <CardHeader
        title="Tareas del Tema"
        titleTypographyProps={{ variant: embedded ? "h6" : "h5" }}
        sx={embedded ? styles.embeddedHeader : styles.header}
        action={
          <Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenCreateModal(true)}
              sx={styles.addButton}
            >
              Nueva Tarea
            </Button>
            <IconButton onClick={fetchTasks} sx={styles.refreshButton}>
              <Refresh style={{ color: '#fff' }} />
            </IconButton>
          </Box>
        }
      />
      <CardContent>
        {tasks.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 5,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay tareas disponibles
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Crea una nueva tarea para este tema haciendo clic en el botón
              "Nueva Tarea"
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenCreateModal(true)}
              sx={{
                backgroundColor: theme.primary,
                color: theme.text,
                "&:hover": {
                  backgroundColor: theme.hover,
                },
              }}
            >
              Crear Primera Tarea
            </Button>
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{ mt: 2, borderRadius: "12px", overflow: "hidden" }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="tasks table">
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.background }}>
                  <TableCell sx={{ fontWeight: 600, color: theme.secondary }}>
                    Tema
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.secondary }}>
                    Título
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.secondary }}>
                    Descripción
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.secondary }}>
                    Fecha Límite
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.secondary }}>
                    Estado
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.secondary }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => {
                  const statusChipProps = getStatusChipProps(task.estado);
                  return (
                    <TableRow key={task.id} sx={tableStyles.tableRow}>
                      <TableCell>{task.tema?.nombre || 'N/A'}</TableCell>
                      <TableCell>{task.titulo}</TableCell>
                      <TableCell>{task.descripcion}</TableCell>
                      <TableCell>
                        {new Date(task.fecha_limite).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip {...statusChipProps} />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          sx={{ color: "#1976d2" }}
                          onClick={() => {
                            setSelectedTask(task);
                            setOpenEditModal(true);
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: "#d32f2f" }}
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Delete />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: "#4caf50" }}
                          onClick={() => router.push(`/admin/manage/tasks/${task.id}`)}
                        >
                          <Description />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>

      {/* Modal para crear tarea */}
      <ModalCreateTask
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSave={handleCreateTask}
        topicId={topicId}
      />

      {/* Modal para editar tarea */}
      <ModalUpdateTask
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        task={selectedTask}
        onSave={handleUpdateTask}
      />
    </Card>
  );
};

export default CrudTasks;