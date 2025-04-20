import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box, Button, Card, CardHeader, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, CircularProgress, Dialog, DialogTitle, DialogContent,
  TextField, IconButton
} from '@mui/material';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import ModalUpdateUnit from './ModalUpdateUnit';  // Changed from ModalEditUnit
import ModalCreateUnits from './ModalCreateUnits';
import { Refresh } from '@mui/icons-material'; // Add this import
import { tableStyles } from '../../../styles/tableStyles';

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

const CrudUnits = () => {
  const router = useRouter();
  const { courseId } = router.query;
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [newUnit, setNewUnit] = useState({
    nombre: '',
    curso: courseId,
    orden: 0
  });

  const fetchUnits = async () => {
    try {
      const token = Cookies.get('accessToken');
      const response = await axios.get(`http://localhost:8000/unidades/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { curso: courseId }
      });
      setUnits(response.data);
    } catch (error) {
      console.error('Error fetching units:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, [courseId]);

  const handleCreateUnit = async (unitData) => { // Now accepts data from modal
    try {
      const token = Cookies.get('accessToken');
      const response = await axios.post('http://localhost:8000/unidades/registrar/', unitData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      Swal.fire('Éxito', 'Unidad creada correctamente', 'success');
      fetchUnits();
      setOpenCreateModal(false);
      setNewUnit({ nombre: '', curso: courseId, orden: 0 });
    } catch (error) {
      console.error('Error creating unit:', error.response?.data);
      Swal.fire('Error', error.response?.data?.message || 'No se pudo crear la unidad', 'error');
    }
  };

  const handleUpdateUnit = async (updatedUnit) => {
    try {
      if (!updatedUnit.id) {
        throw new Error('Unit ID is missing');
      }
      
      const token = Cookies.get('accessToken');
      await axios.put(
        `http://localhost:8000/unidades/actualizar/${updatedUnit.id}/`,
        updatedUnit,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      Swal.fire('Éxito', 'Unidad actualizada correctamente', 'success');
      fetchUnits();
      setOpenEditModal(false);
    } catch (error) {
      console.error('Update error:', error);
      Swal.fire('Error', error.message || 'No se pudo actualizar la unidad', 'error');
    }
  };

  const handleDeleteUnit = async (unitId) => {
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
        await axios.delete(`http://localhost:8000/unidades/eliminar/${unitId}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Eliminado!', 'La unidad ha sido eliminada.', 'success');
        fetchUnits();
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar la unidad', 'error');
      }
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Card sx={styles.card}>
      <CardHeader
        title="Unidades del Curso"
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
              Nueva Unidad
            </Button>
            <IconButton
              onClick={fetchUnits}
              sx={styles.refreshButton}
            >
              <Refresh style={{ color: '#fff' }} />
            </IconButton>
          </Box>
        }
      />
      <CardContent>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="units table">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>Curso</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>Nombre Unidad</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>Orden</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {units.map((unit) => (
                <TableRow key={unit.id} sx={tableStyles.tableRow}>
                  <TableCell>{unit.curso.nombre}</TableCell>
                  <TableCell>{unit.nombre}</TableCell>
                  <TableCell>{unit.orden}</TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      sx={{ color: '#1976d2' }}
                      onClick={() => {
                        setSelectedUnit(unit);
                        setOpenEditModal(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      sx={{ color: '#d32f2f' }}
                      onClick={() => handleDeleteUnit(unit.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      {/* Modal para crear unidad */}
      <ModalCreateUnits
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSave={handleCreateUnit}
        courseId={courseId}
      />

      {/* Modal para editar unidad */}
      <ModalUpdateUnit
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        unit={selectedUnit}
        onSave={handleUpdateUnit}
      />
    </Card>
  );
};

export default CrudUnits;