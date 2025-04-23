import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  CircularProgress,
  CardMedia,
  styled,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import { FolderOpen } from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import { useAlert } from "../../context/AlertContext"; // Ajusta la ruta según tu estructura
import { useRouter } from "next/router";

// Paleta de colores basada en el logo
const theme = {
  primary: "#FFD700", // Amarillo/dorado del logo
  secondary: "#4A4A4A", // Gris oscuro para contraste
  accent: "#F5F5F5", // Gris claro para fondos
  text: "#333333", // Casi negro para texto
  white: "#FFFFFF", // Blanco puro
  hover: "#E6C200", // Amarillo más oscuro para hover
  error: "#ef4444", // Color para botones de eliminar
  success: "#22c55e", // Color para estados de éxito
};

// Componentes estilizados
const StyledCard = styled(Card)(() => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)",
  },
}));

const StyledCardMedia = styled(CardMedia)(() => ({
  height: 200,
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "40%",
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
  },
}));

const StyledCardContent = styled(CardContent)(() => ({
  flexGrow: 1,
  padding: "20px",
}));

const StyledButton = styled(Button)(() => ({
  borderRadius: "8px",
  padding: "8px 16px",
  textTransform: "none",
  fontWeight: "600",
  backgroundColor: theme.primary,
  color: theme.text,
  boxShadow: "none",
  transition: "all 0.3s",
  marginTop: "16px",
  "&:hover": {
    backgroundColor: theme.hover,
    boxShadow: "0 4px 12px rgba(255, 215, 0, 0.3)",
  },
}));

const Courses = ({ onCourseClick }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const { showAlert } = useAlert();
  const router = useRouter();

  const handleExplorarCursos = () => {
    router.push("/student/more-courses");
  };

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = Cookies.get("accessToken");
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const userResponse = await axios.get(
          "http://localhost:8000/usuarios/usuario-actual/",
          {
            headers,
          }
        );
        setCurrentUser(userResponse.data);

        const inscripcionesResponse = await axios.get(
          "http://localhost:8000/inscripciones/",
          {
            headers,
          }
        );

        const misInscripciones = inscripcionesResponse.data.filter(
          (inscripcion) => inscripcion.id_usuario === userResponse.data.id
        );

        const cursosResponse = await axios.get(
          "http://localhost:8000/cursos/listar_cursos/",
          {
            headers,
          }
        );

        const misCursos = misInscripciones
          .map((inscripcion) => {
            const cursoInfo = cursosResponse.data.find(
              (curso) => curso.id === inscripcion.id_curso
            );
            if (cursoInfo) {
              return {
                ...cursoInfo,
                fechaInscripcion: inscripcion.fecha_inscripcion,
                inscripcionId: inscripcion.id,
              };
            }
            return null;
          })
          .filter((curso) => curso !== null);

        setEnrolledCourses(misCursos);
        setLoading(false);
      } catch (err) {
        showAlert({
          message: "Error al cargar los cursos",
          severity: "error",
        });
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  // Función para obtener una imagen por defecto si no hay URL o la URL está vacía
  const getImageUrl = (url) => {
    if (url && url.trim() !== "") {
      return url;
    }
    return "https://via.placeholder.com/300x200?text=Curso"; // Imagen por defecto
  };

  return (
    <Box sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh", pt: 3, pb: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              position: "relative",
              pl: 2,
              mb: 3,
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "4px",
                backgroundColor: theme.primary,
                borderRadius: "4px",
              },
              color: theme.text,
              fontWeight: "600",
            }}
          >
            Mis Cursos
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress sx={{ color: theme.primary }} />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {enrolledCourses.length > 0 ? (
                enrolledCourses.map((course) => (
                  <Grid item xs={12} sm={6} md={4} key={course.inscripcionId}>
                    <StyledCard>
                      <StyledCardMedia
                        component="img"
                        image={getImageUrl(course.imagen_url)}
                        alt={course.nombre}
                      />
                      <StyledCardContent>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "600",
                            color: theme.text,
                            mb: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {course.nombre}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.secondary,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            height: "4.5em", // Aproximadamente 3 líneas
                            mb: 1,
                          }}
                        >
                          {course.descripcion}
                        </Typography>
                        {course.profesor && course.profesor.nombre && (
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: "500",
                              mt: 2,
                              color: theme.secondary,
                            }}
                          >
                            Instructor: {course.profesor.nombre}
                          </Typography>
                        )}
                        <Typography
                          variant="body2"
                          sx={{
                            mt: 1,
                            color: "#7f8c8d",
                            fontStyle: "italic",
                            fontSize: "0.85rem",
                          }}
                        >
                          Inscrito desde:{" "}
                          {new Date(
                            course.fechaInscripcion
                          ).toLocaleDateString()}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <StyledButton
                          fullWidth
                          startIcon={<FolderOpen />}
                          onClick={() => onCourseClick(course.id)}
                        >
                          Ir al curso
                        </StyledButton>
                      </StyledCardContent>
                    </StyledCard>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      p: 4,
                      textAlign: "center",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <Typography sx={{ color: theme.secondary, mb: 2 }}>
                      No estás inscrito en ningún curso todavía.
                    </Typography>
                    <StyledButton onClick={handleExplorarCursos}>
                      Explorar cursos disponibles
                    </StyledButton>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Courses;
