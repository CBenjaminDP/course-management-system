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
import ModalCreateTeacher from "./ModalCreateTeacher";
import ModalUpdateTeacher from "./ModalUpdateTeacher";
import Cookies from "js-cookie";
import axios from "axios";
import { tableStyles } from "../../../styles/tableStyles";
// Import useAlert hook instead of Swal
import { useAlert } from "../../../context/AlertContext";
import { Add, Refresh } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

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
};

const CrudTeachers = () => {
  // Add the useAlert hook
  const { showAlert, showConfirmation } = useAlert();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const fetchTeachers = async () => {
    try {
      const token = Cookies.get("accessToken");
      
      // Check if token exists
      if (!token) {
        setError("No se encontró el token de autenticación. Por favor, inicie sesión nuevamente.");
        setLoading(false);
        return;
      }
      
      const response = await axios.get("http://localhost:8000/usuarios/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const teachersData = response.data.filter(
        (user) => user.rol === "teacher"
      );
      setTeachers(teachersData);
      setError(null);
    } catch (err) {
      // Handle 401 Unauthorized specifically
      if (err.response && err.response.status === 401) {
        setError("Sesión expirada o no autorizada. Por favor, inicie sesión nuevamente.");
        // Optionally redirect to login page
        // window.location.href = '/login';
      } else {
        setError(err.message || "Error al cargar los profesores");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchTeachers();
  };

  const handleCreateTeacher = async (newTeacher) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.post(
        "http://localhost:8000/usuarios/registrar/",
        newTeacher,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        const refreshResponse = await axios.get(
          "http://localhost:8000/usuarios/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const teachersData = refreshResponse.data.filter(
          (user) => user.rol === "teacher"
        );
        setTeachers(teachersData);
        setOpenModal(false);
        
        // Simplified success message without sensitive information
        let successMessage = "Profesor creado correctamente";
        
        // Check if email was sent successfully
        if (response.data.email_enviado) {
          successMessage += ". Se ha enviado un correo con las credenciales al usuario.";
        } else if (response.data.email_error) {
          successMessage += ". Hubo un problema al enviar el correo de credenciales.";
        }
        
        // Use showAlert with simplified message
        showAlert({
          message: successMessage,
          severity: "success",
          duration: 4000,
        });
        
        return true;
      }
      return false;
    } catch (err) {
      // Simplified error message
      showAlert({
        message: err.response?.data?.error || "No se pudo crear el profesor",
        severity: "error",
        duration: 6000,
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
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress sx={{ color: theme.primary }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography color="error">Error: {error}</Typography>
        <StyledButton
          variant="contained"
          onClick={handleRefresh}
          sx={styles.addButton}
        >
          <Refresh style={{ marginRight: "8px" }} />
          Recargar datos
        </StyledButton>
      </Box>
    );
  }

  const handleDelete = async (id) => {
    try {
      if (!id || typeof id !== "string") {
        showAlert({
          message: "ID de profesor no válido",
          severity: "error",
        });
        return;
      }

      const token = Cookies.get("accessToken");
      
      // Use the new confirmation dialog instead of Swal
      showConfirmation({
        title: "¿Estás seguro?",
        message: "¡No podrás revertir esto!",
        onConfirm: async () => {
          try {
            console.log("Deleting teacher with ID:", id);
            console.log("Using token:", token);

            const response = await axios.delete(
              `http://localhost:8000/usuarios/eliminar/${id}/`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                validateStatus: function (status) {
                  return true; // Resolve all status codes
                },
              }
            );

            if (response.status === 200) {
              setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
              showAlert({
                message: "El profesor ha sido eliminado",
                severity: "success",
              });
            } else {
              let errorMessage = `Error del servidor (${response.status})`;
              if (response.data && response.data.message) {
                errorMessage = response.data.message;
              }
              throw new Error(errorMessage);
            }
          } catch (err) {
            let errorMessage = "No se pudo eliminar el profesor. Error del servidor.";

            if (err.response) {
              if (err.response.status === 404) {
                errorMessage = "El profesor no fue encontrado.";
              } else if (err.response.status === 500) {
                errorMessage =
                  "Error interno del servidor. Por favor, inténtelo de nuevo más tarde.";
              }
            }

            showAlert({
              message: errorMessage,
              severity: "error",
              duration: 6000,
            });
            console.error("Error al eliminar:", err);
            console.error("Error details:", err.response?.data);
          }
        },
      });
    } catch (err) {
      showAlert({
        message: "Error al procesar la solicitud",
        severity: "error",
      });
      console.error(err);
    }
  };

  const handleCreateClick = () => {
    setOpenModal(true);
  };

  const handleEditClick = (id) => {
    const teacher = teachers.find((t) => t.id === id);
    setSelectedTeacher(teacher);
    setOpenUpdateModal(true);
  };

  const handleUpdateTeacher = async (id, updatedData) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.put(
        `http://localhost:8000/usuarios/actualizar/${id}/`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Refresh the teacher list
        const refreshResponse = await axios.get(
          "http://localhost:8000/usuarios/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const teachersData = refreshResponse.data.filter(
          (user) => user.rol === "teacher"
        );
        setTeachers(teachersData);

        // Use showAlert instead of Swal
        showAlert({
          message: "Profesor actualizado correctamente",
          severity: "success",
        });
      }
    } catch (err) {
      // Use showAlert for error
      showAlert({
        message: "No se pudo actualizar el profesor",
        severity: "error",
      });
      console.error(err);
    }
  };

  // Update the return statement to include empty state handling
  return (
    <>
      <StyledCard>
        <CardHeader
          title={
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: theme.text }}
            >
              Gestión de Profesores
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
                Agregar Profesor
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
            <Table sx={{ minWidth: 650 }} aria-label="teachers table">
              <TableHead>
                <TableRow sx={styles.tableHeader}>
                  <TableCell sx={styles.tableHeaderCell}>Usuario</TableCell>
                  <TableCell sx={styles.tableHeaderCell}>
                    Nombre Completo
                  </TableCell>
                  <TableCell sx={styles.tableHeaderCell}>Correo</TableCell>
                  <TableCell sx={styles.tableHeaderCell}>Rol</TableCell>
                  <TableCell sx={styles.tableHeaderCell}>
                    Fecha de Creación
                  </TableCell>
                  <TableCell sx={styles.tableHeaderCell}>Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {teachers.length > 0 ? (
                  teachers.map((teacher) => (
                    <TableRow key={teacher.id} sx={styles.tableRow}>
                      <TableCell sx={styles.tableCell}>
                        {teacher.username}
                      </TableCell>
                      <TableCell sx={styles.tableCell}>
                        {teacher.nombre_completo}
                      </TableCell>
                      <TableCell sx={styles.tableCell}>
                        {teacher.email}
                      </TableCell>
                      <TableCell sx={styles.tableCell}>{teacher.rol}</TableCell>
                      <TableCell sx={styles.tableCell}>
                        {new Date(teacher.fecha_creacion).toLocaleDateString()}
                      </TableCell>
                      <TableCell sx={styles.tableCell}>
                        <IconButton
                          size="small"
                          sx={styles.editButton}
                          onClick={() => handleEditClick(teacher.id)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={styles.deleteButton}
                          onClick={() => handleDelete(teacher.id)}
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
                        No hay profesores registrados
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mt: 1, color: "#9e9e9e" }}
                      >
                        Haz clic en "Agregar Profesor" para crear uno nuevo
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </StyledCard>

      {/* Modal for creating teacher */}
      <ModalCreateTeacher
        open={openModal}
        onClose={handleCloseModal}
        onCreate={handleCreateTeacher}
      />

      {/* Modal for updating teacher */}
      <ModalUpdateTeacher
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        onUpdate={handleUpdateTeacher}
        teacher={selectedTeacher}
      />
    </>
  );
};

export default CrudTeachers;
