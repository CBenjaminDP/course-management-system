"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  Box,
  Divider,
  Grid,
  Chip,
  CircularProgress,
  Button,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";
import CourseUnitsView from "./CourseUnitsView";

// Paleta de colores basada en el logo
const theme = {
  primary: "#FFD700", // Amarillo/dorado del logo
  secondary: "#4A4A4A", // Gris oscuro para contraste
  accent: "#F5F5F5", // Gris claro para fondos
  text: "#333333", // Casi negro para texto
  white: "#FFFFFF", // Blanco puro
  hover: "#E6C200", // Amarillo más oscuro para hover
};

const CourseDetailModal = ({ open, onClose, courseId }) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `http://127.0.0.1:8000/cursos/detalle-completo/${courseId}/`
        );
        setCourse(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching course details:", err);
        setError(
          "No se pudieron cargar los detalles del curso. Por favor, inténtalo de nuevo más tarde."
        );
        setLoading(false);
      }
    };

    if (open && courseId) {
      fetchCourseDetails();
    }
  }, [open, courseId]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : "12px",
          overflow: "hidden",
        },
      }}
    >
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
          }}
        >
          <CircularProgress sx={{ color: theme.primary }} />
        </Box>
      ) : error ? (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography color="error">{error}</Typography>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={onClose}>
            Cerrar
          </Button>
        </Box>
      ) : course ? (
        <>
          {/* Header con imagen de fondo */}
          <Box
            sx={{
              height: isMobile ? "200px" : "250px",
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${
                course.imagen_url ||
                "https://via.placeholder.com/1200x300?text=No+Image"
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "20px",
            }}
          >
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: theme.white,
                bgcolor: "rgba(0, 0, 0, 0.3)",
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.5)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>

            <Typography
              variant="h4"
              component="h2"
              sx={{
                color: theme.white,
                fontWeight: "600",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {course.nombre}
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PersonIcon
                  fontSize="small"
                  sx={{ color: theme.primary, mr: 0.5 }}
                />
                <Typography variant="body2" sx={{ color: theme.white }}>
                  {course.profesor.nombre}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CalendarTodayIcon
                  fontSize="small"
                  sx={{ color: theme.primary, mr: 0.5 }}
                />
                <Typography variant="body2" sx={{ color: theme.white }}>
                  {formatDate(course.fecha_inicio)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <DialogContent sx={{ p: 0 }}>
            <Grid container>
              {/* Detalles e información del curso */}
              <Grid item xs={12}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: "600", mb: 1 }}>
                    Descripción del curso
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: theme.secondary, mb: 3 }}
                  >
                    {course.descripcion}
                  </Typography>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" sx={{ fontWeight: "600", mb: 2 }}>
                    Contenido del curso
                  </Typography>

                  <CourseUnitsView units={course.unidades} />
                </Box>
              </Grid>
            </Grid>
          </DialogContent>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 2,
              borderTop: `1px solid ${theme.accent}`,
            }}
          >
            <Button
              variant="contained"
              sx={{
                bgcolor: theme.primary,
                color: theme.text,
                "&:hover": { bgcolor: theme.hover },
                fontWeight: "500",
                boxShadow: "none",
              }}
              onClick={onClose}
            >
              Cerrar
            </Button>
          </Box>
        </>
      ) : (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography>No se encontró información del curso</Typography>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={onClose}>
            Cerrar
          </Button>
        </Box>
      )}
    </Dialog>
  );
};

export default CourseDetailModal;
