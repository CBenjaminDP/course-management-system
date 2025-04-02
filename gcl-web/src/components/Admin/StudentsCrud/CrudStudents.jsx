import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  CircularProgress,
  Typography,
  Paper
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ModalCreateStudent from "./ModalCreateStudent";
import ModalUpdateStudent from "./ModalUpdateStudent";
import Cookies from 'js-cookie';
import axios from 'axios';
import { tableStyles } from '../../../styles/tableStyles';
import Swal from 'sweetalert2';
import { Card, CardHeader, CardContent } from '@mui/material';
import { Add } from '@mui/icons-material';
import { Refresh } from '@mui/icons-material';

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

const CrudStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const fetchStudents = async () => {
    try {
      const token = Cookies.get('accessToken');
      const response = await axios.get('http://localhost:8000/usuarios/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setStudents(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchStudents();
  };

  const handleCreateStudent = async (newStudent) => {
    try {
      const token = Cookies.get('accessToken');
      const response = await axios.post('http://localhost:8000/usuarios/crear/', {
        ...newStudent,
        rol: 'student'
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.status === 201) {
        const refreshResponse = await axios.get('http://localhost:8000/usuarios/estudiantes/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setStudents(refreshResponse.data);
        Swal.fire('Éxito', 'Estudiante creado correctamente', 'success');
      }
    } catch (err) {
      Swal.fire('Error', 'No se pudo crear el estudiante', 'error');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Typography color="error">Error: {error}</Typography>
        <Button 
          variant="contained" 
          onClick={handleRefresh}
          sx={styles.refreshButton}
        >
          <Refresh style={{ marginRight: '8px' }} />
          Recargar datos
        </Button>
      </Box>
    );
  }

  const handleDelete = async (id) => {
    try {
      if (!id || typeof id !== 'string') {
        Swal.fire('Error', 'ID de estudiante no válido', 'error');
        return;
      }
  
      const token = Cookies.get('accessToken');
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!'
      });
  
      if (result.isConfirmed) {
        const response = await axios.delete(`http://localhost:8000/usuarios/eliminar/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          validateStatus: function (status) {
            return true;
          }
        });
  
        if (response.status === 200) {
          setStudents(prev => prev.filter(student => student.id !== id));
          Swal.fire('¡Eliminado!', 'El estudiante ha sido eliminado.', 'success');
        } else {
          let errorMessage = `Error del servidor (${response.status})`;
          if (response.data && response.data.message) {
            errorMessage = response.data.message;
          }
          throw new Error(errorMessage);
        }
      }
    } catch (err) {
      let errorMessage = 'No se pudo eliminar el estudiante. Error del servidor.';
      
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = 'El estudiante no fue encontrado.';
        } else if (err.response.status === 500) {
          errorMessage = 'Error interno del servidor. Por favor, inténtelo de nuevo más tarde.';
        }
      }
  
      Swal.fire('Error', errorMessage, 'error');
      console.error('Error al eliminar:', err);
      console.error('Error details:', err.response?.data);
    }
  };

  const handleCreateClick = () => {
    setOpenModal(true);
  };

  const handleEditClick = (id) => {
    const student = students.find(s => s.id === id);
    setSelectedStudent(student);
    setOpenUpdateModal(true);
  };

  const handleUpdateStudent = async (id, updatedData) => {
    try {
      const token = Cookies.get('accessToken');
      const response = await axios.put(
        `http://localhost:8000/usuarios/actualizar/${id}/`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.status === 200) {
        const refreshResponse = await axios.get('http://localhost:8000/usuarios/estudiantes/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setStudents(refreshResponse.data);
        Swal.fire('Éxito', 'Estudiante actualizado correctamente', 'success');
      }
    } catch (err) {
      Swal.fire('Error', 'No se pudo actualizar el estudiante', 'error');
      console.error(err);
    }
  };

  return (
    <>
      <Card sx={styles.card}>
        <CardHeader
          title="Gestión de Estudiantes"
          titleTypographyProps={{ variant: 'h5' }}
          sx={styles.header}
          action={
            <Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateClick}
                sx={styles.addButton}
              >
                Agregar Estudiante
              </Button>
              <IconButton
                onClick={handleRefresh}
                sx={styles.refreshButton}
              >
                <Refresh style={{ color: '#fff' }} />
              </IconButton>
            </Box>
          }
        />
        <CardContent>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table sx={{ minWidth: 650 }} aria-label="students table">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>Usuario</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>Nombre Completo</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>Correo</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>Rol</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>Fecha de Creación</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id} sx={tableStyles.tableRow}>
                    <TableCell>{student.username}</TableCell>
                    <TableCell>{student.nombre_completo}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.rol}</TableCell>
                    <TableCell>
                      {new Date(student.fecha_creacion).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        sx={{ color: '#1976d2' }}
                        onClick={() => handleEditClick(student.id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        sx={{ color: '#d32f2f' }}
                        onClick={() => handleDelete(student.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <ModalCreateStudent
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreate={handleCreateStudent}
      />

      <ModalUpdateStudent
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        onUpdate={handleUpdateStudent}
        student={selectedStudent}
      />
    </>
  );
};

export default CrudStudents;