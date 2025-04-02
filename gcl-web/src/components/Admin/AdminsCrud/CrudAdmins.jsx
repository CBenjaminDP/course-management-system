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
import ModalCreateAdmin from "./ModalCreateAdmin";
import Cookies from 'js-cookie';
import axios from 'axios';

const CrudAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);

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

  const handleCreateAdmin = (newAdmin) => {
    setAdmins((prev) => [...prev, { ...newAdmin, id: prev.length + 1 }]);
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

  return (
    <Box sx={{ width: "100%" }}>
      <Button
        variant="contained"
        onClick={() => setOpenModal(true)}
        sx={{
          mb: 2,
          bgcolor: "#1a1a1a",
          "&:hover": {
            bgcolor: "#333",
          },
        }}
      >
        Add New Admin
      </Button>

      <ModalCreateAdmin
        open={openModal}
        handleClose={() => setOpenModal(false)}
        handleCreate={handleCreateAdmin}
      />

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="admins table">
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
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.username}</TableCell>
                <TableCell>{admin.nombre_completo}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.rol}</TableCell>
                <TableCell>
                  {new Date(admin.fecha_creacion).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton size="small" sx={{ color: '#1a1a1a' }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" sx={{ color: '#1a1a1a' }}>
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