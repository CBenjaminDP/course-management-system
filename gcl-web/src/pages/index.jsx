import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
  AppBar,
  Toolbar,
  Box,
  GlobalStyles,
  useMediaQuery,
  CircularProgress,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Carousel from "react-material-ui-carousel";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";

// Estilos globales actualizados con tema minimalista
const globalStyles = (
  <GlobalStyles
    styles={{
      body: {
        margin: 0,
        padding: 0,
        fontFamily: "'Poppins', 'Roboto', sans-serif",
        backgroundColor: "#f8f9fa",
      },
      html: { margin: 0, padding: 0 },
      "::selection": { backgroundColor: "#FFD700", color: "#333" },
    }}
  />
);

// Paleta de colores basada en el logo
const theme = {
  primary: "#FFD700", // Amarillo/dorado del logo
  secondary: "#4A4A4A", // Gris oscuro para contraste
  accent: "#F5F5F5", // Gris claro para fondos
  text: "#333333", // Casi negro para texto
  white: "#FFFFFF", // Blanco puro
  hover: "#E6C200", // Amarillo más oscuro para hover
};

const HomePage = () => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:600px)"); // Detecta si es móvil
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://127.0.0.1:8000/cursos/listar_cursos/"
        );
        setCourses(response.data);
        setFilteredCourses(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Función para manejar la búsqueda
  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(
        (course) =>
          course.nombre.toLowerCase().includes(term.toLowerCase()) ||
          course.descripcion.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleRegisterClick = () => {
    router.push("/register");
  };

  return (
    <>
      {globalStyles}
      <Box
        sx={{
          backgroundImage: "linear-gradient(to bottom, #fff, #f8f9fa)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* Navbar con diseño minimalista */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            backgroundColor: theme.white,
            color: theme.text,
            borderBottom: `1px solid ${theme.accent}`,
            width: "100%",
          }}
        >
          <Toolbar>
            {/* Logo */}
            <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
              <img
                src="/logo_nav.png"
                alt="Logo"
                style={{
                  height: isMobile ? "40px" : "60px",
                  marginRight: isMobile ? "16px" : "86px",
                }}
              />
            </Box>

            {/* Botones de Iniciar sesión y Registrar */}
            <Box>
              <Button
                variant="text"
                onClick={handleLoginClick}
                sx={{
                  mx: 1,
                  textTransform: "none",
                  fontWeight: "500",
                  color: theme.secondary,
                  "&:hover": {
                    color: theme.primary,
                  },
                }}
              >
                Iniciar sesión
              </Button>
              <Button
                variant="contained"
                onClick={handleRegisterClick}
                sx={{
                  mx: 1,
                  borderRadius: "4px",
                  textTransform: "none",
                  fontWeight: "500",
                  padding: isMobile ? "6px 12px" : "8px 20px",
                  backgroundColor: theme.primary,
                  color: theme.text,
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: theme.hover,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                Registrar
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Carrusel con diseño minimalista */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: isMobile ? "400px" : "600px",
            }}
          >
            <CircularProgress sx={{ color: theme.primary }} />
          </Box>
        ) : error ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: isMobile ? "400px" : "600px",
            }}
          >
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <Carousel
            sx={{ marginBottom: "32px" }}
            animation="fade"
            navButtonsAlwaysVisible={!isMobile}
            fullHeightHover
            indicatorContainerProps={{
              style: {
                marginTop: "-40px",
                position: "relative",
                zIndex: 1,
              },
            }}
            indicatorIconButtonProps={{
              style: {
                color: "rgba(255, 215, 0, 0.5)",
              },
            }}
            activeIndicatorIconButtonProps={{
              style: {
                color: theme.primary,
              },
            }}
            navButtonsProps={{
              style: {
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                color: theme.secondary,
                borderRadius: "50%",
                padding: "8px",
              },
            }}
          >
            {courses.slice(0, 3).map((course) => (
              <Box
                key={course.id}
                sx={{
                  position: "relative",
                  height: isMobile ? "400px" : "600px",
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${
                    course.imagen_url ||
                    "https://via.placeholder.com/1200x700?text=No+Image"
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme.white,
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    padding: "30px",
                    borderRadius: "8px",
                    maxWidth: "80%",
                    backdropFilter: "blur(5px)",
                    border: `1px solid rgba(255, 215, 0, 0.3)`,
                  }}
                >
                  <Typography
                    variant={isMobile ? "h4" : "h3"}
                    component="h2"
                    sx={{ fontWeight: "600" }}
                  >
                    {course.nombre}
                  </Typography>
                  <Typography
                    variant={isMobile ? "body1" : "h6"}
                    sx={{ marginTop: "10px", opacity: 0.9 }}
                  >
                    {course.descripcion}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      marginTop: "20px",
                      backgroundColor: theme.primary,
                      color: theme.text,
                      fontWeight: "bold",
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: theme.hover,
                        boxShadow: "0 4px 12px rgba(255, 215, 0, 0.3)",
                      },
                    }}
                    onClick={() => router.push(`/courses/${course.id}`)}
                  >
                    Ver curso
                  </Button>
                </Box>
              </Box>
            ))}
          </Carousel>
        )}

        {/* Contenido principal con diseño minimalista */}
        <Container sx={{ py: 8 }} maxWidth="lg">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: "600",
                color: theme.text,
                position: "relative",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: "-10px",
                  left: "0",
                  width: "60px",
                  height: "4px",
                  backgroundColor: theme.primary,
                },
              }}
            >
              Cursos Disponibles
            </Typography>
          </div>

          {/* Buscador de cursos con diseño minimalista */}
          <Box sx={{ mb: 5, display: "flex", justifyContent: "center" }}>
            <TextField
              variant="outlined"
              placeholder="Buscar cursos por nombre o descripción..."
              fullWidth
              value={searchTerm}
              onChange={handleSearch}
              sx={{
                maxWidth: "800px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: theme.white,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.primary,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.primary,
                    borderWidth: "1px",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: theme.secondary }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress sx={{ color: theme.primary }} />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: "center", my: 4 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          ) : filteredCourses.length === 0 ? (
            <Box sx={{ textAlign: "center", my: 4 }}>
              <Typography variant="h6" sx={{ color: theme.secondary }}>
                No se encontraron cursos que coincidan con tu búsqueda.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={4}>
              {filteredCourses.map((course) => (
                <Grid item key={course.id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "8px",
                      border: "1px solid #eee",
                      boxShadow: "none",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      overflow: "hidden",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)",
                        "& .MuiCardMedia-root": {
                          transform: "scale(1.05)",
                        },
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={
                        course.imagen_url ||
                        "https://via.placeholder.com/300x200?text=No+Image"
                      }
                      alt={course.nombre}
                      sx={{
                        transition: "transform 0.5s ease",
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, padding: "1.5rem" }}>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="h2"
                        sx={{ fontWeight: "600", color: theme.text }}
                      >
                        {course.nombre}
                      </Typography>
                      <Typography
                        sx={{
                          color: theme.secondary,
                          fontSize: "0.9rem",
                          lineHeight: "1.5",
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {course.descripcion}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: theme.text }}
                        >
                          Instructor:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ ml: 1, color: theme.secondary }}
                        >
                          {course.profesor.nombre}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.secondary,
                          mb: 2,
                          fontSize: "0.8rem",
                        }}
                      >
                        {new Date(course.fecha_inicio).toLocaleDateString()} -{" "}
                        {new Date(course.fecha_fin).toLocaleDateString()}
                      </Typography>
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                          mt: "auto",
                          textTransform: "none",
                          borderColor: theme.primary,
                          color: theme.text,
                          fontWeight: 500,
                          "&:hover": {
                            backgroundColor: theme.primary,
                            borderColor: theme.primary,
                            color: theme.text,
                          },
                        }}
                        onClick={() => router.push(`/courses/${course.id}`)}
                      >
                        Ver detalles
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>

        {/* Footer minimalista */}
        <Box
          component="footer"
          sx={{
            backgroundColor: theme.white,
            padding: "20px",
            marginTop: "40px",
            textAlign: "center",
            borderTop: `1px solid ${theme.accent}`,
          }}
        >
          <Typography variant="body2" sx={{ color: theme.secondary }}>
            © {new Date().getFullYear()} SCDL. Todos los derechos reservados.
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default HomePage;
