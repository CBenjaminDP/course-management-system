import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
  Box,
  GlobalStyles,
  useMediaQuery,
  Snackbar,
  Alert,
  InputAdornment,
  TextField,
  CircularProgress,
  styled,
  Divider,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import Cookies from "js-cookie";
import { useAlert } from "../../context/AlertContext"; // Ajusta la ruta según tu estructura

// Paleta de colores basada en el logo (igual que componentes anteriores)
const theme = {
  primary: "#FFD700", // Amarillo/dorado del logo
  secondary: "#4A4A4A", // Gris oscuro para contraste
  accent: "#F5F5F5", // Gris claro para fondos
  text: "#333333", // Casi negro para texto
  white: "#FFFFFF", // Blanco puro
  hover: "#E6C200", // Amarillo más oscuro para hover
  error: "#ef4444", // Color para botones de eliminar
  success: "#22c55e", // Color para estados de éxito
  blue: "#3b82f6", // Color azul para botones de acción secundarios
};

// Estilos globales para eliminar márgenes y rellenos predeterminados
const globalStyles = (
  <GlobalStyles
    styles={{
      body: { margin: 0, padding: 0, backgroundColor: "#f9f9f9" },
      html: { margin: 0, padding: 0 },
    }}
  />
);

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

const StyledButton = styled(Button)(({ enrolled }) => ({
  borderRadius: "8px",
  padding: "10px 20px",
  textTransform: "none",
  fontWeight: "600",
  backgroundColor: enrolled ? theme.success : theme.primary,
  color: theme.text,
  boxShadow: "none",
  transition: "all 0.3s",
  marginTop: "16px",
  "&:hover": {
    backgroundColor: enrolled ? "#1ea34b" : theme.hover,
    boxShadow: enrolled
      ? "0 4px 12px rgba(34, 197, 94, 0.3)"
      : "0 4px 12px rgba(255, 215, 0, 0.3)",
    transform: "scale(1.02)",
  },
  "&.Mui-disabled": {
    backgroundColor: "#cccccc",
    color: "#666666",
  },
}));

const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    transition: "all 0.3s",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.primary,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.primary,
      borderWidth: "1px",
    },
  },
  "& .MuiFormLabel-root.Mui-focused": {
    color: theme.secondary,
  },
}));

const MoreCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useMediaQuery("(max-width:600px)");
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = Cookies.get("accessToken");
      const headers = { Authorization: `Bearer ${token}` };

      // Obtener usuario actual
      const userResponse = await axios.get(
        "http://localhost:8000/usuarios/usuario-actual/",
        { headers }
      );
      setCurrentUser(userResponse.data);

      // Obtener inscripciones
      const inscripcionesResponse = await axios.get(
        "http://localhost:8000/inscripciones/",
        { headers }
      );
      const misInscripciones = inscripcionesResponse.data.filter(
        (inscripcion) => inscripcion.id_usuario === userResponse.data.id
      );
      setEnrolledCourses(misInscripciones.map((insc) => insc.id_curso));

      // Obtener cursos
      const cursosResponse = await axios.get(
        "http://localhost:8000/cursos/listar_cursos",
        { headers }
      );
      setCourses(cursosResponse.data);
      setLoading(false);
    } catch (error) {
      showAlert({
        message: "Error al cargar los datos de cursos",
        severity: "error",
      });
      setLoading(false);
    }
  };

  const handleEnrollment = async (courseId) => {
    try {
      const token = Cookies.get("accessToken");

      const inscripcionData = {
        id_usuario: currentUser.id,
        id_curso: courseId,
        fecha_inscripcion: new Date().toISOString().split("T")[0],
      };

      await axios.post(
        "http://localhost:8000/inscripciones/registrar/",
        inscripcionData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEnrolledCourses([...enrolledCourses, courseId]);

      showAlert({
        message: "¡Inscripción exitosa!",
        severity: "success",
      });
    } catch (error) {
      showAlert({
        message: error.response?.data?.error || "Error al inscribirse al curso",
        severity: "error",
      });
    }
  };

  // Filtrar cursos en base a búsqueda
  const filteredCourses = courses.filter(
    (course) =>
      course.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.profesor &&
        course.profesor.nombre &&
        course.profesor.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Función para obtener una imagen por defecto si no hay URL o la URL está vacía
  const getImageUrl = (url) => {
    if (url && url.trim() !== "") {
      return url;
    }
    return "https://via.placeholder.com/500x250?text=Curso"; // Imagen por defecto
  };

  return (
    <>
      {globalStyles}
      <Box
        sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh", pt: 3, pb: 8 }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              mb: 4,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                position: "relative",
                pl: 2,
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
              Cursos Disponibles
            </Typography>

            <StyledTextField
              fullWidth
              variant="outlined"
              placeholder="Buscar por nombre, descripción o instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                maxWidth: "600px",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <CircularProgress sx={{ color: theme.primary }} />
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <Grid item key={course.id} xs={12} sm={6} md={4}>
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
                          <Divider sx={{ my: 2 }} />
                          <StyledButton
                            fullWidth
                            enrolled={enrolledCourses.includes(course.id)}
                            onClick={() => handleEnrollment(course.id)}
                            disabled={enrolledCourses.includes(course.id)}
                          >
                            {enrolledCourses.includes(course.id)
                              ? "Ya estás inscrito"
                              : "Inscribirme"}
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
                        No se encontraron cursos que coincidan con tu búsqueda.
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </>
          )}
        </Container>
      </Box>
    </>
  );
};

export default MoreCourses;
