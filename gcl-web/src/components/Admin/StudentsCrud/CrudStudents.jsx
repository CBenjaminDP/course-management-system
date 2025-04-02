import React, { useState, useEffect } from "react";
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, IconButton, CircularProgress, Typography, Paper
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ModalCreateStudent from "./ModalCreateStudent";
import ModalUpdateStudent from "./ModalUpdateStudent";
import Cookies from 'js-cookie';
import axios from 'axios';
import { tableStyles } from '../../../styles/tableStyles';
import Swal from 'sweetalert2';

const CrudStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = Cookies.get('accessToken');
        const response = await axios.get('http://localhost:8000/usuarios/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const studentsData = response.data.filter(user => user.rol === 'student');
        setStudents(studentsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleCreateStudent = async (newStudent) => {
    try {
      const token = Cookies.get('accessToken');
      const response = await axios.post('http://localhost:8000/usuarios/registrar/', {
        ...newStudent,
        rol: 'estudiante'
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        const refreshResponse = await axios.get('http://localhost:8000/usuarios/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const studentsData = refreshResponse.data.filter(user => user.rol === 'estudiante');
        setStudents(studentsData);
        
        Swal.fire('Success', 'Student created successfully', 'success');
      }
    } catch (err) {
      Swal.fire('Error', 'Failed to create student', 'error');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
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
          }
        });

        if (response.status === 200) {
          setStudents(prev => prev.filter(student => student.id !== id));
          Swal.fire('¡Eliminado!', 'El estudiante ha sido eliminado.', 'success');
        }
      }
    } catch (err) {
      Swal.fire('Error', 'Failed to delete student', 'error');
      console.error(err);
    }
  };

  const handleEdit = (id) => {
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
        const refreshResponse = await axios.get('http://localhost:8000/usuarios/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const studentsData = refreshResponse.data.filter(user => user.rol === 'estudiante');
        setStudents(studentsData);
        
        Swal.fire('Success', 'Student updated successfully', 'success');
      }
    } catch (err) {
      Swal.fire('Error', 'Failed to update student', 'error');
      console.error(err);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Button
        variant="contained"
        onClick={() => setOpenModal(true)}
        sx={{ mb: 2 }}
      >
        Add New Student
      </Button>

      <ModalCreateStudent
        open={openModal}
        handleClose={() => setOpenModal(false)}
        handleCreate={handleCreateStudent}
      />

      <ModalUpdateStudent
        open={openUpdateModal}
        handleClose={() => setOpenUpdateModal(false)}
        student={selectedStudent}
        handleUpdate={handleUpdateStudent}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.username}</TableCell>
                <TableCell>{student.nombre_completo}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  {new Date(student.fecha_creacion).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(student.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(student.id)}>
                    <DeleteIcon />
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

export default CrudStudents;