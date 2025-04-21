import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import { Add, Edit, Delete, Refresh } from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import ModalUpdateUnit from "./ModalUpdateUnit";
import ModalCreateUnits from "./ModalCreateUnits";
import { tableStyles } from "../../../styles/tableStyles";
import { useAlert } from "../../../context/AlertContext"; // Import useAlert hook

// Define theme colors to match login
const theme = {
  primary: "#FFD700", // Gold
  secondary: "#4A4A4A",
  text: "#333333",
  hover: "#E6C200",
  background: "#f8f9fa",
};

const styles = {
  card: {
    margin: "24px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    borderRadius: "16px",
  },
  header: {
    backgroundColor: theme.primary,
    color: theme.text,
    borderRadius: "12px 12px 0 0",
  },
  addButton: {
    margin: "16px",
    backgroundColor: theme.primary,
    color: theme.text,
    borderRadius: "20px",
    padding: "8px 24px",
    "&:hover": {
      backgroundColor: theme.hover,
      boxShadow: "0 4px 12px rgba(255, 215, 0, 0.3)",
    },
  },
  refreshButton: {
    margin: "0 8px",
    backgroundColor: theme.secondary,
    color: "#ffffff",
    borderRadius: "20px",
    "&:hover": {
      backgroundColor: "#333333",
      transform: "rotate(180deg)",
      transition: "transform 0.5s",
    },
  },
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
    nombre: "",
    curso: courseId,
    orden: 0,
  });
  const { showAlert, showConfirmation } = useAlert();

  const fetchUnits = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("accessToken");

      console.log("Fetching units for course:", courseId);
      // Get all units
      const response = await axios.get(`http://localhost:8000/unidades/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("All units response:", response.data);

      // Convert courseId to string to ensure consistent comparison
      const courseIdStr = String(courseId);

      // Filter units by courseId on the client side
      const filteredUnits = Array.isArray(response.data)
        ? response.data.filter((unit) => {
            console.log(
              `Comparing unit.curso.id: ${unit.curso.id} (${typeof unit.curso
                .id}) with courseId: ${courseIdStr} (${typeof courseIdStr})`
            );
            return unit.curso && String(unit.curso.id) === courseIdStr;
          })
        : [];

      console.log("Filtered units for course:", filteredUnits);
      setUnits(filteredUnits);
    } catch (error) {
      console.error("Error fetching units:", error);
      if (error.response?.status === 401) {
        showAlert({
          message: "Sesión expirada. Por favor inicie sesión nuevamente.",
          severity: "error",
        });
        router.push("/login");
      } else {
        showAlert({
          message:
            "No se pudieron cargar las unidades: " +
            (error.message || "Error desconocido"),
          severity: "error",
        });
      }
      // Set empty array in case of error
      setUnits([]);
    } finally {
      setLoading(false);
    }
  };

  // Add a debug useEffect to log when units change
  useEffect(() => {
    console.log("Current units state:", units);
  }, [units]);

  useEffect(() => {
    if (courseId) {
      console.log("courseId changed, fetching units");
      fetchUnits();
    } else {
      console.log("No courseId yet");
      setLoading(false);
    }
  }, [courseId]);

  const handleCreateUnit = async (unitData) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.post(
        "http://localhost:8000/unidades/registrar/",
        unitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      showAlert({
        message: "Unidad creada correctamente",
        severity: "success",
      });
      fetchUnits();
      setOpenCreateModal(false);
      setNewUnit({ nombre: "", curso: courseId, orden: 0 });
    } catch (error) {
      console.error("Error creating unit:", error.response?.data);
      showAlert({
        message: error.response?.data?.message || "No se pudo crear la unidad",
        severity: "error",
      });
    }
  };

  const handleUpdateUnit = async (updatedUnit) => {
    try {
      if (!updatedUnit.id) {
        throw new Error("Unit ID is missing");
      }

      const token = Cookies.get("accessToken");
      await axios.put(
        `http://localhost:8000/unidades/actualizar/${updatedUnit.id}/`,
        updatedUnit,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      showAlert({
        message: "Unidad actualizada correctamente",
        severity: "success",
      });
      fetchUnits();
      setOpenEditModal(false);
    } catch (error) {
      console.error("Update error:", error);
      showAlert({
        message: error.message || "No se pudo actualizar la unidad",
        severity: "error",
      });
    }
  };

  const handleDeleteUnit = async (unitId) => {
    showConfirmation({
      title: "¿Estás seguro?",
      message: "¡No podrás revertir esta acción!",
      onConfirm: async () => {
        try {
          const token = Cookies.get("accessToken");
          await axios.delete(
            `http://localhost:8000/unidades/eliminar/${unitId}/`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          showAlert({
            message: "La unidad ha sido eliminada",
            severity: "success",
          });
          fetchUnits();
        } catch (error) {
          showAlert({
            message: "No se pudo eliminar la unidad",
            severity: "error",
          });
        }
      },
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card sx={styles.card}>
      <CardHeader
        title="Unidades del Curso"
        titleTypographyProps={{ variant: "h5" }}
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
            <IconButton onClick={fetchUnits} sx={styles.refreshButton}>
              <Refresh style={{ color: "#fff" }} />
            </IconButton>
          </Box>
        }
      />
      <CardContent>
        {units.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 5,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay unidades disponibles
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Crea una nueva unidad para este curso haciendo clic en el botón
              "Nueva Unidad"
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenCreateModal(true)}
              sx={{
                backgroundColor: theme.primary,
                color: theme.text,
                "&:hover": {
                  backgroundColor: theme.hover,
                },
              }}
            >
              Crear Primera Unidad
            </Button>
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{ mt: 2, borderRadius: "12px", overflow: "hidden" }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="units table">
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.background }}>
                  <TableCell sx={{ fontWeight: 600, color: theme.secondary }}>
                    Curso
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.secondary }}>
                    Nombre Unidad
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.secondary }}>
                    Orden
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.secondary }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {units.map((unit) => (
                  <TableRow key={unit.id} sx={tableStyles.tableRow}>
                    <TableCell>{unit.curso?.nombre || "N/A"}</TableCell>
                    <TableCell>{unit.nombre}</TableCell>
                    <TableCell>{unit.orden}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        sx={{ color: "#1976d2" }}
                        onClick={() => {
                          setSelectedUnit(unit);
                          setOpenEditModal(true);
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ color: "#d32f2f" }}
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
        )}
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
