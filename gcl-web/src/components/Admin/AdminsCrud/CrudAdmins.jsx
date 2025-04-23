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
  Paper,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ModalCreateAdmin from "./ModalCreateAdmin";
import ModalUpdateAdmin from "./ModalUpdateAdmin";
import Cookies from 'js-cookie';
import axios from 'axios';
import { tableStyles } from '../../../styles/tableStyles';
import { Add } from '@mui/icons-material';
import { Refresh } from '@mui/icons-material';
import { styled } from "@mui/material/styles";
import { useAlert } from '../../../context/AlertContext'; // Import the alert context

// Define theme colors to match login
const theme = {
  primary: "#FFD700", // Gold
  secondary: "#4A4A4A",
  text: "#333333",
  hover: "#E6C200",
  background: "#f8f9fa",
};

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  margin: "24px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
  borderRadius: "16px",
  overflow: "hidden",
  backgroundColor: "#fff",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.09)",
    transform: "translateY(-2px)",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  padding: "8px 16px",
  textTransform: "none",
  fontWeight: "600",
  boxShadow: "none",
  transition: "all 0.3s",
}));

// Update styles
const styles = {
  header: {
    backgroundColor: "#FFD700",
    color: "#333333",
    padding: "16px 24px",
    borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
  },
  addButton: {
    backgroundColor: "#FFD700",
    color: "#333333",
    "&:hover": {
      backgroundColor: "#E6C200",
      boxShadow: "0 4px 12px rgba(255, 215, 0, 0.3)",
    },
  },
  refreshButton: {
    backgroundColor: "#f5f5f5",
    color: "#4A4A4A",
    marginLeft: "8px",
    "&:hover": {
      backgroundColor: "#e0e0e0",
      transform: "rotate(180deg)",
      transition: "transform 0.5s",
    },
  },
  tableHeader: {
    backgroundColor: "#f8f9fa",
  },
  tableHeaderCell: {
    fontWeight: 600,
    color: "#4A4A4A",
    padding: "16px",
  },
  tableRow: {
    "&:nth-of-type(odd)": {
      backgroundColor: "#fafafa",
    },
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
    transition: "background-color 0.2s",
  },
  tableCell: {
    padding: "16px",
  },
  editButton: {
    color: "#FFD700",
    "&:hover": {
      backgroundColor: "rgba(255, 215, 0, 0.1)",
    },
  },
  deleteButton: {
    color: "#ff5252",
    "&:hover": {
      backgroundColor: "rgba(255, 82, 82, 0.1)",
    },
  },
  emptyState: {
    textAlign: "center",
    padding: "32px 16px",
  },
};

const CrudAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null); // Add state for current user ID
  const { showAlert, showConfirmation } = useAlert();

  // Get current user info when component mounts
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = Cookies.get('accessToken');
        if (!token) return;
        
        // Change the endpoint to the correct one that exists in your API
        const response = await axios.get('http://localhost:8000/usuarios/usuario-actual/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.id) {
          setCurrentUserId(response.data.id);
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    };
    
    fetchCurrentUser();
  }, []);

  const fetchAdmins = async () => {
    try {
      const token = Cookies.get('accessToken');
      
      // Check if token exists
      if (!token) {
        setError("No se encontró el token de autenticación. Por favor, inicie sesión nuevamente.");
        setLoading(false);
        return;
      }
      
      const response = await axios.get('http://localhost:8000/usuarios/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const adminsData = response.data.filter(user => user.rol === 'admin');
      setAdmins(adminsData);
      setError(null);
    } catch (err) {
      // Handle 401 Unauthorized specifically
      if (err.response && err.response.status === 401) {
        setError("Sesión expirada o no autorizada. Por favor, inicie sesión nuevamente.");
      } else {
        setError(err.message || "Error al cargar los administradores");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchAdmins();
  };

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
        setOpenModal(false);
        
        // Use the alert context instead of SweetAlert2
        let successMessage = "Administrador creado correctamente";
        
        if (response.data && response.data.email_enviado) {
          successMessage += ". Se ha enviado un correo con las credenciales al usuario.";
        } else if (response.data && response.data.email_error) {
          successMessage += ". Hubo un problema al enviar el correo de credenciales.";
        }
        
        showAlert({ 
          message: successMessage, 
          severity: "success" 
        });
        return true;
      }
      return false;
    } catch (err) {
      showAlert({ 
        message: err.response?.data?.error || 'No se pudo crear el administrador', 
        severity: "error" 
      });
      setOpenModal(false); // Cerrar el modal en caso de error
      console.error(err);
      return false;
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress sx={{ color: theme.primary }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Typography color="error">Error: {error}</Typography>
        <StyledButton 
          variant="contained" 
          onClick={handleRefresh}
          sx={styles.addButton}
        >
          <Refresh style={{ marginRight: '8px' }} />
          Recargar datos
        </StyledButton>
      </Box>
    );
  }

  const handleDelete = async (id) => {
    try {
      if (!id || typeof id !== 'string') {
        showAlert({ 
          message: 'ID de administrador no válido', 
          severity: "error" 
        });
        return;
      }
      
      // Check if user is trying to delete their own account
      if (id === currentUserId) {
        showAlert({ 
          message: 'No puedes eliminar tu propia cuenta de administrador', 
          severity: "warning" 
        });
        return;
      }
  
      const token = Cookies.get('accessToken');
      
      // Use the confirmation dialog from context
      showConfirmation({
        title: '¿Estás seguro?',
        message: "Esta acción eliminará permanentemente al administrador y no podrá ser recuperado.",
        onConfirm: async () => {
          try {
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
              setAdmins(prev => prev.filter(admin => admin.id !== id));
              showAlert({ 
                message: 'El administrador ha sido eliminado correctamente', 
                severity: "success" 
              });
            } else {
              let errorMessage = `Error del servidor (${response.status})`;
              if (response.data && response.data.message) {
                errorMessage = response.data.message;
              }
              throw new Error(errorMessage);
            }
          } catch (err) {
            let errorMessage = 'No se pudo eliminar el administrador. Error del servidor.';
            
            if (err.response) {
              if (err.response.status === 404) {
                errorMessage = 'El administrador no fue encontrado.';
              } else if (err.response.status === 500) {
                errorMessage = 'Error interno del servidor. Por favor, inténtelo de nuevo más tarde.';
              }
            }
        
            showAlert({ 
              message: errorMessage, 
              severity: "error" 
            });
            console.error('Error al eliminar:', err);
            console.error('Error details:', err.response?.data);
          }
        }
      });
    } catch (err) {
      showAlert({ 
        message: 'Error al procesar la solicitud', 
        severity: "error" 
      });
      console.error(err);
    }
  };

  const handleCreateClick = () => {
    setOpenModal(true);
  };

  const handleEditClick = (id) => {
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
        showAlert({ 
          message: 'Administrador actualizado correctamente', 
          severity: "success" 
        });
      }
    } catch (err) {
      showAlert({ 
        message: 'No se pudo actualizar el administrador', 
        severity: "error" 
      });
      console.error(err);
    }
  };

  return (
    <>
      <StyledCard>
        <CardHeader
          title={
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: theme.text }}
            >
              Gestión de Administradores
            </Typography>
          }
          sx={styles.header}
          action={
            <Box>
              <StyledButton
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateClick}
                sx={styles.addButton}
              >
                Agregar Administrador
              </StyledButton>
              <IconButton onClick={handleRefresh} sx={styles.refreshButton}>
                <Refresh />
              </IconButton>
            </Box>
          }
        />
        <CardContent sx={{ p: 0 }}>
          <TableContainer
            component={Paper}
            sx={{ boxShadow: "none", borderRadius: 0 }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="admins table">
              <TableHead>
                <TableRow sx={styles.tableHeader}>
                  <TableCell sx={styles.tableHeaderCell}>Usuario</TableCell>
                  <TableCell sx={styles.tableHeaderCell}>Nombre</TableCell>
                  <TableCell sx={styles.tableHeaderCell}>Correo</TableCell>
                  <TableCell sx={styles.tableHeaderCell}>Rol</TableCell>
                  <TableCell sx={styles.tableHeaderCell}>Fecha Creación</TableCell>
                  <TableCell sx={styles.tableHeaderCell}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              
              <TableBody>
                {admins.length > 0 ? (
                  admins.map((admin) => (
                    <TableRow key={admin.id} sx={styles.tableRow}>
                      <TableCell sx={styles.tableCell}>{admin.username}</TableCell>
                      <TableCell sx={styles.tableCell}>{admin.nombre_completo}</TableCell>
                      <TableCell sx={styles.tableCell}>{admin.email}</TableCell>
                      <TableCell sx={styles.tableCell}>{admin.rol}</TableCell>
                      <TableCell sx={styles.tableCell}>
                        {new Date(admin.fecha_creacion).toLocaleDateString()}
                      </TableCell>
                      <TableCell sx={styles.tableCell}>
                        <IconButton 
                          size="small" 
                          sx={styles.editButton}
                          onClick={() => handleEditClick(admin.id)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          sx={styles.deleteButton}
                          onClick={() => handleDelete(admin.id)}
                          disabled={admin.id === currentUserId} // Disable delete button for current user
                          style={admin.id === currentUserId ? { color: '#ccc', cursor: 'not-allowed' } : {}}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} sx={styles.emptyState}>
                      <Typography variant="body1">
                        No hay administradores registrados
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mt: 1, color: "#9e9e9e" }}
                      >
                        Haz clic en "Agregar Administrador" para crear uno nuevo
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </StyledCard>

      <ModalCreateAdmin
        open={openModal}
        onClose={handleCloseModal}
        onCreate={handleCreateAdmin}
      />

      <ModalUpdateAdmin
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        onUpdate={handleUpdateAdmin}
        admin={selectedAdmin}
      />
    </>
  );
};

export default CrudAdmins;