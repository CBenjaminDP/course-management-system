import React, { useState, useEffect } from 'react';
import {
  Box, Button, Card, CardHeader, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, CircularProgress, IconButton
} from '@mui/material';
import { Add, Edit, Delete, Refresh } from '@mui/icons-material';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { tableStyles } from '../../../styles/tableStyles';
import ModalCreateTask from './ModalCreateTask';
import ModalUpdateTask from './ModalUpdateTask';

const styles = {
  card: {
    margin: '24px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    borderRadius: '12px'
  },
  header: {
    backgroundColor: '#1976d2',
    color: '#fff',
    borderRadius: '12px 12px 0 0'
  },
  addButton: {
    margin: '16px',
    backgroundColor: '#4caf50',
    borderRadius: '20px',
    padding: '8px 24px',
    '&:hover': {
      backgroundColor: '#388e3c'
    }
  },
  refreshButton: {
    margin: '0 8px',
    backgroundColor: '#1976d2',
    borderRadius: '20px',
    '&:hover': {
      backgroundColor: '#1565c0'
    }
  }
};

const CrudTasks = ({ topicId }) => {
  const [tasks, setTasks] = useState([]);
  // Remove loading state
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const token = Cookies.get('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`http://localhost:8000/tareas/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { tema: topicId }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      if (error.response?.status === 401) {
        Swal.fire('Error', 'Sesión expirada. Por favor inicie sesión nuevamente.', 'error');
      } else {
        Swal.fire('Error', 'No se pudieron cargar las tareas', 'error');
      }
    }
    // Remove finally block
  };

  useEffect(() => {
    fetchTasks();
  }, [topicId]);

  const handleUpdateTask = async (updatedTask) => {
    try {
      const token = Cookies.get('accessToken');
      const payload = {
        titulo: updatedTask.titulo.trim(),
        descripcion: updatedTask.descripcion.trim(),
        fecha_entrega: updatedTask.fecha_entrega,
        tema: updatedTask.tema
      };
      
      const response = await axios.put(
        `http://localhost:8000/tareas/actualizar/${updatedTask.id}/`,
        payload,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      Swal.fire('Éxito', 'Tarea actualizada correctamente', 'success');
      fetchTasks();
      setOpenEditModal(false);
    } catch (error) {
      console.error('Error updating task:', error);
      Swal.fire('Error', 'No se pudo actualizar la tarea', 'error');
    }
  };
  
  const handleDeleteTask = async (taskId) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
  
    if (result.isConfirmed) {
      try {
        const token = Cookies.get('accessToken');
        await axios.delete(`http://localhost:8000/tareas/eliminar/${taskId}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Eliminado!', 'La tarea ha sido eliminada.', 'success');
        fetchTasks();
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar la tarea', 'error');
      }
    }
  };
  
  const handleCreateTask = async (taskData) => {
    try {
      const token = Cookies.get('accessToken');
      const response = await axios.post('http://localhost:8000/tareas/registrar/', taskData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      Swal.fire('Éxito', 'Tarea creada correctamente', 'success');
      fetchTasks();
      setOpenCreateModal(false);
    } catch (error) {
      console.error('Error creating task:', error.response?.data);
      Swal.fire('Error', error.response?.data?.message || 'No se pudo crear la tarea', 'error');
    }
  };

  return (
    <Card sx={styles.card}>
      <CardHeader
        title="Gestión de Tareas"
        titleTypographyProps={{ variant: 'h5' }}
        sx={styles.header}
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
            <IconButton
              onClick={fetchTasks}
              sx={styles.refreshButton}
            >
              <Refresh style={{ color: '#fff' }} />
            </IconButton>
          </Box>
        }
      />
      
      <CardContent>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="tasks table">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600 }}>Título</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tema</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Descripción</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Fecha Entrega</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id} sx={tableStyles.tableRow}>
                  <TableCell>{task.titulo}</TableCell>
                  <TableCell>{task.tema}</TableCell>
                  <TableCell>{task.descripcion}</TableCell>
                  <TableCell>{task.fecha_entrega}</TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary"
                      onClick={() => {
                        setSelectedTask(task);
                        setOpenEditModal(true);
                      }}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error"
                      onClick={() => handleDeleteTask(task.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      <ModalCreateTask
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSave={handleCreateTask}
        topicId={topicId}
      />

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