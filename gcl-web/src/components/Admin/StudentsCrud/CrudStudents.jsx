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
import ModalCreateStudent from "./ModalCreateStudent";
import ModalUpdateStudent from "./ModalUpdateStudent";
import Cookies from "js-cookie";
import axios from "axios";
import { tableStyles } from "../../../styles/tableStyles";
import { useAlert } from "../../../context/AlertContext";
import { Add, Refresh } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Define theme colors to match teacher components
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
    fontWeight: "600",
    color: "#4A4A4A",
  },
  actionButton: {
    padding: "4px",
  },
  editIcon: {
    color: "#FFD700",
  },
  deleteIcon: {
    color: "#ff5252",
  },
};

const CrudStudents = () => {
  const { showAlert, showConfirmation } = useAlert();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("accessToken");
      const response = await axios.get("http://localhost:8000/usuarios/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const studentsData = response.data.filter(
        (user) => user.rol === "student"
      );
      setStudents(studentsData);
      setLoading(false);
    } catch (err) {
      setError("Error al cargar los estudiantes");
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleCreateStudent = async (newStudent) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.post(
        "http://localhost:8000/usuarios/registrar/",
        {
          ...newStudent,
          rol: "student",
        },
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

        const studentsData = refreshResponse.data.filter(
          (user) => user.rol === "student"
        );
        setStudents(studentsData);
        setOpenModal(false);
        
        // Simplified success message without sensitive information
        let successMessage = "Estudiante creado correctamente";
        
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
        message: err.response?.data?.error || "No se pudo crear el estudiante",
        severity: "error",
        duration: 6000,
      });
      console.error(err);
      return false;
    }
  };

  // Add the missing handleCreateClick function
  const handleCreateClick = () => {
    setOpenModal(true);
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setOpenUpdateModal(true);
  };

  // Add the missing handleDelete function
  const handleDelete = async (id) => {
    try {
      if (!id || typeof id !== "string") {
        showAlert({
          message: "ID de estudiante no válido",
          severity: "error",
        });
        return;
      }

      const token = Cookies.get("accessToken");
      
      showConfirmation({
        title: "¿Estás seguro?",
        message: "¡No podrás revertir esto!",
        onConfirm: async () => {
          try {
            console.log("Deleting student with ID:", id);
            const response = await axios.delete(
              `http://localhost:8000/usuarios/eliminar/${id}/`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                validateStatus: function (status) {
                  return true;
                },
              }
            );

            if (response.status === 200) {
              setStudents((prev) => prev.filter((student) => student.id !== id));
              showAlert({
                message: "El estudiante ha sido eliminado",
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
            let errorMessage = "No se pudo eliminar el estudiante. Error del servidor.";

            if (err.response) {
              if (err.response.status === 404) {
                errorMessage = "El estudiante no fue encontrado.";
              } else if (err.response.status === 500) {
                errorMessage = "Error interno del servidor. Por favor, inténtelo de nuevo más tarde.";
              }
            }

            showAlert({
              message: errorMessage,
              severity: "error",
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

  // Add the missing handleUpdateStudent function
  const handleUpdateStudent = async (id, updatedData) => {
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
        const refreshResponse = await axios.get(
          "http://localhost:8000/usuarios/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const studentsData = refreshResponse.data.filter(
          (user) => user.rol === "student"
        );
        setStudents(studentsData);
        setOpenUpdateModal(false);
        showAlert({
          message: "Estudiante actualizado correctamente",
          severity: "success",
        });
      }
    } catch (err) {
      showAlert({
        message: err.response?.data?.error || "No se pudo actualizar el estudiante",
        severity: "error",
      });
      console.error(err);
    }
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
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <StyledCard>
      <CardHeader
        title="Gestión de Estudiantes"
        sx={styles.header}
        action={
          <Box>
            <StyledButton
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateClick}
              sx={styles.addButton}
            >
              Agregar Estudiante
            </StyledButton>
            <IconButton
              onClick={fetchStudents}
              sx={styles.refreshButton}
            >
              <Refresh />
            </IconButton>
          </Box>
        }
      />
      <CardContent>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead sx={styles.tableHeader}>
              <TableRow>
                <TableCell sx={styles.tableHeaderCell}>Usuario</TableCell>
                <TableCell sx={styles.tableHeaderCell}>Nombre Completo</TableCell>
                <TableCell sx={styles.tableHeaderCell}>Correo</TableCell>
                <TableCell sx={styles.tableHeaderCell}>Rol</TableCell>
                <TableCell sx={styles.tableHeaderCell}>Fecha de Creación</TableCell>
                <TableCell sx={styles.tableHeaderCell} align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.username}</TableCell>
                  <TableCell>{student.nombre_completo}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.rol}</TableCell>
                  <TableCell>
                    {new Date(student.fecha_creacion).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleEditClick(student)}
                      sx={styles.actionButton}
                    >
                      <EditIcon sx={styles.editIcon} />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(student.id)}
                      sx={styles.actionButton}
                    >
                      <DeleteIcon sx={styles.deleteIcon} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

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
    </StyledCard>
  );
};

export default CrudStudents;
