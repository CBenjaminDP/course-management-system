import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
import ModalCreateTopic from './ModalCreateTopic';
import ModalUpdateTopic from './ModalUpdateTopic';

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

const CrudTopics = ({ unitId }) => {
  const [topics, setTopics] = useState([]);
  const [units, setUnits] = useState([]); // Add units state
  const [loading, setLoading] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const fetchTopics = async () => {
    try {
      const token = Cookies.get('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`http://localhost:8000/temas/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { unidad: unitId }
      });
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
      if (error.response?.status === 401) {
        Swal.fire('Error', 'Sesión expirada. Por favor inicie sesión nuevamente.', 'error');
        // Optionally redirect to login page:
        // router.push('/login');
      } else {
        Swal.fire('Error', 'No se pudieron cargar los temas', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUnits = async () => {
    try {
      const token = Cookies.get('accessToken');
      const response = await axios.get('http://localhost:8000/unidades/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnits(response.data);
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchUnits(); // Fetch units when component mounts
  }, [unitId]);

  // Add these functions inside your CrudTopics component
  
  const handleUpdateTopic = async (updatedTopic) => {
    try {
      const token = Cookies.get('accessToken');
      
      // Ensure we're sending the unit ID, not the name
      const unidadId = units.find(u => u.nombre === updatedTopic.unidad)?.id || updatedTopic.unidad;
      
      const payload = {
        nombre: updatedTopic.nombre.trim(),
        descripcion: updatedTopic.descripcion.trim(),
        orden: Number(updatedTopic.orden),
        unidad: unidadId
      };
      
      console.log('Final payload being sent:', JSON.stringify(payload, null, 2));
      
      const response = await axios.put(
        `http://localhost:8000/temas/actualizar/${updatedTopic.id}/`,
        payload,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      Swal.fire('Éxito', 'Tema actualizado correctamente', 'success');
      fetchTopics();
      setOpenEditModal(false);
    } catch (error) {
      console.error('Full error response:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      
      let errorMessage = 'No se pudo actualizar el tema';
      if (error.response?.data) {
        // Manejar diferentes formatos de error
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (Array.isArray(error.response.data)) {
          errorMessage = error.response.data.join('\n');
        } else if (typeof error.response.data === 'object') {
          // Intentar extraer mensajes de error en diferentes formatos
          errorMessage = Object.entries(error.response.data)
            .map(([field, errors]) => {
              if (Array.isArray(errors)) {
                return `${field}: ${errors.join(', ')}`;
              }
              return `${field}: ${errors}`;
            })
            .join('\n');
        }
      }
      
      Swal.fire('Error', errorMessage, 'error');
    }
  };
  
  const handleDeleteTopic = async (topicId) => {
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
        await axios.delete(`http://localhost:8000/temas/eliminar/${topicId}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Eliminado!', 'El tema ha sido eliminado.', 'success');
        fetchTopics();
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el tema', 'error');
      }
    }
  };
  
  const handleCreateTopic = async (topicData) => {
    try {
      const token = Cookies.get('accessToken');
      const response = await axios.post('http://localhost:8000/temas/registrar/', {
        nombre: topicData.nombre,
        descripcion: topicData.descripcion,
        orden: topicData.orden,
        unidad: topicData.unidad // Use selected unit
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      Swal.fire('Éxito', 'Tema creado correctamente', 'success');
      fetchTopics();
      setOpenCreateModal(false);
    } catch (error) {
      console.error('Error creating topic:', error);
      Swal.fire('Error', error.response?.data?.message || 'No se pudo crear el tema', 'error');
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Card sx={styles.card}>
      <CardHeader
        title="Temas de la Unidad"
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
              Nuevo Tema
            </Button>
            <IconButton
              onClick={fetchTopics}
              sx={styles.refreshButton}
            >
              <Refresh style={{ color: '#fff' }} />
            </IconButton>
          </Box>
        }
      />
      <CardContent>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="topics table">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Unidad</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Descripción</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Orden</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topics.map((topic) => (
                <TableRow key={topic.id} sx={tableStyles.tableRow}>
                  <TableCell>{topic.nombre}</TableCell>
                  <TableCell>
                    {units.find(u => u.id === topic.unidad)?.nombre || topic.unidad}
                  </TableCell>
                  <TableCell>{topic.descripcion}</TableCell>
                  <TableCell>{topic.orden}</TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary"
                      onClick={() => {
                        setSelectedTopic(topic);
                        setOpenEditModal(true);
                      }}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error"
                      onClick={() => handleDeleteTopic(topic.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>


    {/* Add these modal components right before the closing Card tag */}
    <ModalCreateTopic
      open={openCreateModal}
      onClose={() => setOpenCreateModal(false)}
      onSave={handleCreateTopic}
      units={units} // Pass units data
    />

    <ModalUpdateTopic
      open={openEditModal}
      onClose={() => setOpenEditModal(false)}
      topic={selectedTopic}
      onSave={handleUpdateTopic}
      units={units}  // Add this line
    />
  </Card>
  );
};

export default CrudTopics;