import React, { useState, useEffect } from "react";
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, IconButton, CircularProgress, Typography, Paper
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ModalCreateAdmin from "./ModalCreateAdmin";
import ModalUpdateAdmin from "./ModalUpdateAdmin";
import Cookies from 'js-cookie';
import axios from 'axios';
import { tableStyles } from '../../../styles/tableStyles';
import Swal from 'sweetalert2';

const CrudAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = Cookies.get('accessToken');
        const response = await axios.get('http://localhost:8000/usuarios/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const adminsData = response.data.filter(user => user.rol === 'admin');
        setAdmins(adminsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (newAdmin) => {
    try {
      const token = Cookies.get('accessToken');
      const response = await axios.post('http://localhost:8000/usuarios/registrar/', {
        ...newAdmin,
        rol: 'admin'
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
        
        const adminsData = refreshResponse.data.filter(user => user.rol === 'admin');
        setAdmins(adminsData);
        
        Swal.fire('Success', 'Admin created successfully', 'success');
      }
    } catch (err) {
      Swal.fire('Error', 'Failed to create admin', 'error');
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
          setAdmins(prev => prev.filter(admin => admin.id !== id));
          Swal.fire('¡Eliminado!', 'El admin ha sido eliminado.', 'success');
        }
      }
    } catch (err) {
      Swal.fire('Error', 'Failed to delete admin', 'error');
      console.error(err);
    }
  };

  const handleEdit = (id) => {
    const admin = admins.find(a => a.id === id);
    setSelectedAdmin(admin);
    setOpenUpdateModal(true);
  };

  const handleUpdateAdmin = async (id, updatedData) => {
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
        
        const adminsData = refreshResponse.data.filter(user => user.rol === 'admin');
        setAdmins(adminsData);
        
        Swal.fire('Success', 'Admin updated successfully', 'success');
      }
    } catch (err) {
      Swal.fire('Error', 'Failed to update admin', 'error');
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
        Add New Admin
      </Button>

      <ModalCreateAdmin
        open={openModal}
        handleClose={() => setOpenModal(false)}
        handleCreate={handleCreateAdmin}
      />

      <ModalUpdateAdmin
        open={openUpdateModal}
        handleClose={() => setOpenUpdateModal(false)}
        admin={selectedAdmin}
        handleUpdate={handleUpdateAdmin}
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
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.username}</TableCell>
                <TableCell>{admin.nombre_completo}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>
                  {new Date(admin.fecha_creacion).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(admin.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(admin.id)}>
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

export default CrudAdmins;