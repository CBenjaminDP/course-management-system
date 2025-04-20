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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ModalCreateTeacher from "./ModalCreateTeacher";
import ModalUpdateTeacher from "./ModalUpdateTeacher";
import Cookies from "js-cookie";
import axios from "axios";
import { tableStyles } from "../../../styles/tableStyles";
import Swal from "sweetalert2";
import { Card, CardHeader, CardContent } from "@mui/material";
import { Add } from "@mui/icons-material";
import { Refresh } from "@mui/icons-material";

// Update styles
const styles = {
  card: {
    margin: "24px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    borderRadius: "12px",
  },
  header: {
    backgroundColor: "#1976d2",
    color: "#fff",
    borderRadius: "12px 12px 0 0",
  },
  addButton: {
    margin: "16px",
    backgroundColor: "#4caf50", // Changed to green
    borderRadius: "20px",
    padding: "8px 24px",
    "&:hover": {
      backgroundColor: "#388e3c", // Darker green on hover
    },
  },
  refreshButton: {
    margin: "0 8px",
    backgroundColor: "#1976d2", // Changed to blue
    borderRadius: "20px",
    "&:hover": {
      backgroundColor: "#1565c0",
    },
  },
};

const CrudTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const fetchTeachers = async () => {
    try {
      const token = Cookies.get("accessToken");
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
      setError(err.message);
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
        Swal.fire("Éxito", "Profesor creado correctamente", "success");
        return true;
      }
      return false;
    } catch (err) {
      Swal.fire("Error", "No se pudo crear el profesor", "error");
      console.error(err);
      return false;
    }
  };

  // Add this new function to handle modal closing
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
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
        <Button
          variant="contained"
          onClick={handleRefresh}
          sx={styles.refreshButton}
        >
          <Refresh style={{ marginRight: "8px" }} />
          Recargar datos
        </Button>
      </Box>
    );
  }

  const handleDelete = async (id) => {
    try {
      if (!id || typeof id !== "string") {
        Swal.fire("Error", "ID de profesor no válido", "error");
        return;
      }

      const token = Cookies.get("accessToken");
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar!",
      });

      if (result.isConfirmed) {
        // Add debug logging
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
          Swal.fire("¡Eliminado!", "El profesor ha sido eliminado.", "success");
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
      let errorMessage = "No se pudo eliminar el profesor. Error del servidor.";

      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = "El profesor no fue encontrado.";
        } else if (err.response.status === 500) {
          errorMessage =
            "Error interno del servidor. Por favor, inténtelo de nuevo más tarde.";
        }
      }

      Swal.fire("Error", errorMessage, "error");
      console.error("Error al eliminar:", err);
      console.error("Error details:", err.response?.data);
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

        Swal.fire("Success", "Teacher updated successfully", "success");
      }
    } catch (err) {
      Swal.fire("Error", "Failed to update teacher", "error");
      console.error(err);
    }
  };

  return (
    <>
      <Card sx={styles.card}>
        <CardHeader
          title="Gestión de Profesores"
          titleTypographyProps={{ variant: "h5" }}
          sx={styles.header}
          action={
            <Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateClick} // Changed to use handler
                sx={styles.addButton}
              >
                Agregar Profesor
              </Button>
              <IconButton onClick={handleRefresh} sx={styles.refreshButton}>
                <Refresh style={{ color: "#fff" }} />
              </IconButton>
            </Box>
          }
        />
        <CardContent>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table sx={{ minWidth: 650 }} aria-label="teachers table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                    Usuario
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                    Nombre Completo
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                    Correo
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                    Rol
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                    Fecha de Creación
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                    Acciones
                  </TableCell>
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
                        sx={{ ...styles.actionButton, color: "#1976d2" }}
                        onClick={() => handleEditClick(teacher.id)} // Changed to use handler
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ ...styles.actionButton, color: "#d32f2f" }}
                        onClick={() => handleDelete(teacher.id)}
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
