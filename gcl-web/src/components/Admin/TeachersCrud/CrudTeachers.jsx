import React, { useState, useEffect } from "react";
import {Box,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Button,IconButton,CircularProgress,Typography,Paper} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ModalCreateTeacher from "./ModalCreateTeacher";
import ModalUpdateTeacher from "./ModalUpdateTeacher";
import Cookies from 'js-cookie';
import axios from 'axios';
import { tableStyles } from '../../../styles/tableStyles';
import Swal from 'sweetalert2';

const CrudTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = Cookies.get('accessToken');
        const response = await axios.get('http://localhost:8000/usuarios/', {  // Changed endpoint
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Filter users with role 'teacher'
        const teachersData = response.data.filter(user => user.rol === 'teacher');
        setTeachers(teachersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleCreateTeacher = async (newTeacher) => {
    try {
      const token = Cookies.get('accessToken');
      const response = await axios.post('http://localhost:8000/usuarios/registrar/', newTeacher, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.status === 201) {
        // Refresh the teacher list
        const refreshResponse = await axios.get('http://localhost:8000/usuarios/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const teachersData = refreshResponse.data.filter(user => user.rol === 'teacher');
        setTeachers(teachersData);
        
        Swal.fire('Success', 'Teacher created successfully', 'success');
      }
    } catch (err) {
      Swal.fire('Error', 'Failed to create teacher', 'error');
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
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  const handleDelete = async (id) => {
    try {
      if (!id || typeof id !== 'string') {
        Swal.fire('Error', 'ID de profesor no válido', 'error');
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
        // Add debug logging
        console.log('Deleting teacher with ID:', id);
        console.log('Using token:', token);
  
        const response = await axios.delete(`http://localhost:8000/usuarios/eliminar/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          validateStatus: function (status) {
            return true; // Resolve all status codes
          }
        });
  
        if (response.status === 200) {
          setTeachers(prev => prev.filter(teacher => teacher.id !== id));
          Swal.fire('¡Eliminado!', 'El profesor ha sido eliminado.', 'success');
        } else {
          // Handle specific error codes
          let errorMessage = `Error del servidor (${response.status})`;
          if (response.data && response.data.message) {
            errorMessage = response.data.message;
          }
          throw new Error(errorMessage);
        }
      }
    } catch (err) {
      let errorMessage = 'No se pudo eliminar el profesor. Error del servidor.';
      
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = 'El profesor no fue encontrado.';
        } else if (err.response.status === 500) {
          errorMessage = 'Error interno del servidor. Por favor, inténtelo de nuevo más tarde.';
        }
      }
  
      Swal.fire('Error', errorMessage, 'error');
      console.error('Error al eliminar:', err);
      console.error('Error details:', err.response?.data);
    }
  };

  const handleEdit = (id) => {
    const teacher = teachers.find(t => t.id === id);
    setSelectedTeacher(teacher);
    setOpenUpdateModal(true);
  };

  const handleUpdateTeacher = async (id, updatedData) => {
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
        // Refresh the teacher list
        const refreshResponse = await axios.get('http://localhost:8000/usuarios/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const teachersData = refreshResponse.data.filter(user => user.rol === 'teacher');
        setTeachers(teachersData);
        
        Swal.fire('Success', 'Teacher updated successfully', 'success');
      }
    } catch (err) {
      Swal.fire('Error', 'Failed to update teacher', 'error');
      console.error(err);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Button
        variant="contained"
        onClick={() => setOpenModal(true)}
        sx={{
          mb: 0,
          bgcolor: "#1a1a1a",
          "&:hover": {
            bgcolor: "#333",
          },
        }}
      >
        Add New Teacher
      </Button>

      <ModalCreateTeacher
        open={openModal}
        handleClose={() => setOpenModal(false)}
        handleCreate={handleCreateTeacher}
      />

      <ModalUpdateTeacher
        open={openUpdateModal}
        handleClose={() => setOpenUpdateModal(false)}
        teacher={selectedTeacher}
        handleUpdate={handleUpdateTeacher}
      />

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="teachers table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>Username</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>Full Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>Created Date</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id} sx={tableStyles.tableRow}>
                <TableCell>{teacher.username}</TableCell>
                <TableCell>{teacher.nombre_completo}</TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>{teacher.rol}</TableCell>
                <TableCell>
                  {new Date(teacher.fecha_creacion).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton 
                    size="small" 
                    sx={tableStyles.actionIcons}
                    onClick={() => handleEdit(teacher.id)}
                  >
                    <EditIcon sx={tableStyles.editIcon} />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    sx={tableStyles.actionIcons}
                    onClick={() => handleDelete(teacher.id)}
                  >
                    <DeleteIcon sx={tableStyles.deleteIcon} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CrudTeachers;
