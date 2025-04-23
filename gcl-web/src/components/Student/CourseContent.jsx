import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Divider,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Collapse,
  CircularProgress,
  useMediaQuery,
  LinearProgress,
  Chip,
  styled,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  PlayCircleOutline,
  MenuBook,
  Assignment,
  Quiz,
  CheckCircle,
  ArrowBack,
  VideoLibrary,
  Home,
} from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import { useAlert } from "../../context/AlertContext";

// Paleta de colores
const theme = {
  primary: "#FFD700", // Amarillo/dorado del logo
  secondary: "#4A4A4A", // Gris oscuro para contraste
  accent: "#F5F5F5", // Gris claro para fondos
  text: "#333333", // Casi negro para texto
  white: "#FFFFFF", // Blanco puro
  hover: "#E6C200", // Amarillo más oscuro para hover
  error: "#ef4444", // Color para botones de eliminar
  success: "#22c55e", // Verde para completado
  blue: "#3b82f6", // Azul para elementos interactivos
  purple: "#8b5cf6", // Púrpura para destacar
  teal: "#0d9488", // Verde azulado para variedad
  lightYellow: "rgba(255, 215, 0, 0.1)", // Fondo amarillo claro
};

// Componentes estilizados
const StyledCard = styled(Card)(({ completed }) => ({
  borderRadius: "12px",
  transition: "all 0.3s ease",
  overflow: "hidden",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
  border: completed ? `1px solid ${theme.success}` : "none",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.15)",
  },
}));

const StyledCardMedia = styled(CardMedia)(() => ({
  height: 160,
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "50%",
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
  },
}));

const SectionTitle = styled(Typography)(({ theme, variant }) => ({
  position: "relative",
  paddingLeft: "16px",
  marginBottom: "20px",
  fontWeight: "600",
  color: theme.text,
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "4px",
    backgroundColor:
      variant === "unit"
        ? theme.blue
        : variant === "topic"
        ? theme.purple
        : variant === "task"
        ? theme.teal
        : theme.primary,
    borderRadius: "4px",
  },
}));

const UnitCard = styled(Paper)(({ active, completed }) => ({
  padding: "16px",
  marginBottom: "16px",
  borderRadius: "12px",
  transition: "all 0.3s ease",
  backgroundColor: active ? theme.lightYellow : theme.white,
  borderLeft: completed
    ? `4px solid ${theme.success}`
    : active
    ? `4px solid ${theme.primary}`
    : `4px solid transparent`,
  boxShadow: active
    ? "0 4px 20px rgba(0, 0, 0, 0.1)"
    : "0 2px 8px rgba(0, 0, 0, 0.05)",
  "&:hover": {
    backgroundColor: active ? theme.lightYellow : "rgba(0, 0, 0, 0.02)",
    transform: "translateX(5px)",
  },
}));

const TopicCard = styled(Paper)(({ active, completed }) => ({
  padding: "12px 16px",
  marginBottom: "12px",
  borderRadius: "8px",
  transition: "all 0.3s ease",
  backgroundColor: active ? theme.lightYellow : theme.white,
  borderLeft: completed
    ? `3px solid ${theme.success}`
    : active
    ? `3px solid ${theme.purple}`
    : `3px solid transparent`,
  boxShadow: active
    ? "0 4px 15px rgba(0, 0, 0, 0.08)"
    : "0 1px 5px rgba(0, 0, 0, 0.03)",
  "&:hover": {
    backgroundColor: active ? theme.lightYellow : "rgba(0, 0, 0, 0.01)",
    transform: "translateX(3px)",
  },
}));

const TaskCard = styled(Box)(({ type, completed }) => {
  const getTypeColor = () => {
    switch (type) {
      case "video":
        return "#ef4444"; // Rojo para video
      case "quiz":
        return "#8b5cf6"; // Púrpura para quiz
      case "reading":
        return "#0891b2"; // Cyan para lectura
      case "assignment":
        return "#f59e0b"; // Ámbar para tarea
      default:
        return theme.blue;
    }
  };

  return {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    marginBottom: "8px",
    borderRadius: "8px",
    backgroundColor: completed
      ? "rgba(34, 197, 94, 0.15)" // Verde más intenso para tareas completadas
      : "rgba(255, 255, 255, 0.9)",
    border: `1px solid ${
      completed ? "rgba(34, 197, 94, 0.5)" : "rgba(0, 0, 0, 0.06)"
    }`,
    boxShadow: completed
      ? "0 2px 8px rgba(34, 197, 94, 0.2)"
      : "0 2px 5px rgba(0, 0, 0, 0.03)",
    transition: "all 0.2s ease",
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: "4px",
      backgroundColor: completed ? theme.success : getTypeColor(),
      borderTopLeftRadius: "8px",
      borderBottomLeftRadius: "8px",
    },
    "&:hover": {
      transform: "translateX(3px)",
      boxShadow: completed
        ? "0 4px 12px rgba(34, 197, 94, 0.25)"
        : "0 4px 10px rgba(0, 0, 0, 0.05)",
    },
  };
});

const ProgressContainer = styled(Box)(({ value }) => ({
  position: "relative",
  height: "8px",
  width: "100%",
  backgroundColor: "rgba(0,0,0,0.05)",
  borderRadius: "4px",
  overflow: "hidden",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: `${value}%`,
    backgroundColor: value === 100 ? theme.success : theme.primary,
    borderRadius: "4px",
  },
}));

const StyledButton = styled(Button)(({ variant }) => ({
  borderRadius: "8px",
  padding: "8px 16px",
  textTransform: "none",
  fontWeight: "600",
  boxShadow: "none",
  transition: "all 0.3s",
  backgroundColor: variant === "secondary" ? "transparent" : theme.primary,
  color: variant === "secondary" ? theme.text : theme.text,
  border: variant === "secondary" ? `1px solid ${theme.primary}` : "none",
  "&:hover": {
    backgroundColor:
      variant === "secondary" ? "rgba(255, 215, 0, 0.1)" : theme.hover,
    boxShadow:
      variant === "secondary" ? "none" : "0 4px 12px rgba(255, 215, 0, 0.3)",
  },
}));

// Funciones auxiliares
const getTaskIcon = (type) => {
  switch (type) {
    case "video":
      return <VideoLibrary />;
    case "quiz":
      return <Quiz />;
    case "reading":
      return <MenuBook />;
    case "assignment":
      return <Assignment />;
    default:
      return <Assignment />;
  }
};

const getTaskTypeName = (type) => {
  switch (type) {
    case "video":
      return "Video";
    case "quiz":
      return "Cuestionario";
    case "reading":
      return "Lectura";
    case "assignment":
      return "Tarea";
    default:
      return "Actividad";
  }
};

const CourseContent = ({ courseId, onBack }) => {
  const { showAlert, showConfirmation } = useAlert();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [units, setUnits] = useState([]);
  const [topics, setTopics] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [expandedUnit, setExpandedUnit] = useState(null);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [activeUnit, setActiveUnit] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [courseProgress, setCourseProgress] = useState(0);
  const [userProgress, setUserProgress] = useState([]);
  const [progressData, setProgressData] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [inscripcionId, setInscripcionId] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
      checkEnrollmentStatus();
    }
  }, [courseId]);

  // Obtener datos del curso
  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("accessToken");
      const headers = { Authorization: `Bearer ${token}` };

      const courseResponse = await axios.get(
        `http://localhost:8000/cursos/detalle-completo/${courseId}/`,
        { headers }
      );

      const courseData = courseResponse.data;
      setCourse(courseData);

      // Establecer unidades directamente
      if (courseData.unidades && courseData.unidades.length > 0) {
        setUnits(courseData.unidades);

        // Configurar la primera unidad por defecto
        const firstUnit = courseData.unidades[0];
        setExpandedUnit(firstUnit.id);
        setActiveUnit(firstUnit.id);

        // Establecer temas directamente de la primera unidad
        if (firstUnit.temas && firstUnit.temas.length > 0) {
          setTopics(firstUnit.temas);

          const firstTopic = firstUnit.temas[0];
          setExpandedTopic(firstTopic.id);
          setActiveTopic(firstTopic.id);

          // Establecer tareas directamente del primer tema
          if (firstTopic.tareas && firstTopic.tareas.length > 0) {
            setTasks(firstTopic.tareas);
            setActiveTask(firstTopic.tareas[0].id);
          }
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error al cargar los datos del curso:", error);
      showAlert({
        message: "Error al cargar el contenido del curso",
        severity: "error",
      });
      setLoading(false);
    }
  };

  // Verificar si el usuario está inscrito y obtener su progreso
  const checkEnrollmentStatus = async () => {
    try {
      setLoadingProgress(true);
      const token = Cookies.get("accessToken");
      const headers = { Authorization: `Bearer ${token}` };

      // Obtener usuario actual
      const userResponse = await axios.get(
        "http://localhost:8000/usuarios/usuario-actual/",
        { headers }
      );
      const userId = userResponse.data.id;

      // Obtener inscripciones del usuario
      const inscripcionesResponse = await axios.get(
        "http://localhost:8000/inscripciones/",
        { headers }
      );

      // Filtrar para encontrar la inscripción en este curso
      const misInscripciones = inscripcionesResponse.data.filter(
        (inscripcion) =>
          inscripcion.id_usuario === userId && inscripcion.id_curso === courseId
      );

      if (misInscripciones.length > 0) {
        setIsEnrolled(true);
        setInscripcionId(misInscripciones[0].id);

        // Obtener el progreso del usuario en este curso
        await fetchUserProgress();
      } else {
        setIsEnrolled(false);
      }

      setLoadingProgress(false);
    } catch (error) {
      console.error("Error al verificar la inscripción:", error);
      setLoadingProgress(false);
    }
  };

  // Obtener el progreso del usuario en el curso
  const fetchUserProgress = async () => {
    try {
      const token = Cookies.get("accessToken");
      const headers = { Authorization: `Bearer ${token}` };

      const progressResponse = await axios.get(
        `http://localhost:8000/inscripciones/estado-tareas/${courseId}/`,
        { headers }
      );

      const data = progressResponse.data;
      setProgressData(data);
      setCourseProgress(parseFloat(data.porcentaje_completado));

      // Extraer las tareas completadas
      const completedTasksIds = [];
      data.unidades.forEach((unidad) => {
        unidad.temas.forEach((tema) => {
          tema.tareas.forEach((tarea) => {
            if (tarea.completada) {
              completedTasksIds.push(tarea.id);
            }
          });
        });
      });

      setUserProgress(completedTasksIds);
    } catch (error) {
      console.error("Error al obtener el progreso:", error);
    }
  };

  // Marcar una tarea como completada
  const handleMarkComplete = async (taskId) => {
    try {
      const token = Cookies.get("accessToken");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post(
        "http://localhost:8000/inscripciones/marcar-tarea-completada/",
        {
          tarea_id: taskId,
          curso_id: courseId,
        },
        { headers }
      );

      // Actualizar el estado local
      const newProgress = [...userProgress];
      if (!newProgress.includes(taskId)) {
        newProgress.push(taskId);
        setUserProgress(newProgress);
      }

      // Actualizar el progreso desde el servidor
      await fetchUserProgress();

      showAlert({
        message: "¡Tarea marcada como completada!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error al marcar la tarea como completada:", error);
      showAlert({
        message: "Error al actualizar el progreso",
        severity: "error",
      });
    }
  };

  const handleResetProgress = async () => {
    // Verificar si el progreso ya está en 0%
    if (courseProgress === 0) {
      showAlert({
        message: "No hay progreso que reiniciar. El curso ya está en 0%.",
        severity: "info",
        title: "Sin cambios",
      });
      return; // Salir de la función si no hay progreso que reiniciar
    }

    // Si hay progreso, mostrar el diálogo de confirmación
    showConfirmation({
      title: "Reiniciar progreso",
      message:
        "¿Estás seguro de que deseas reiniciar todo tu progreso en este curso? Esta acción no se puede deshacer.",
      confirmButtonText: "Sí, reiniciar",
      cancelButtonText: "Cancelar",
      onConfirm: async () => {
        try {
          const token = Cookies.get("accessToken");
          const headers = { Authorization: `Bearer ${token}` };

          await axios.post(
            `http://localhost:8000/inscripciones/reiniciar-progreso/${inscripcionId}/`,
            {},
            { headers }
          );

          // Reiniciar el estado local
          setUserProgress([]);
          setCourseProgress(0);

          // Actualizar el progreso desde el servidor
          await fetchUserProgress();

          showAlert({
            message: "Progreso reiniciado correctamente",
            severity: "success",
          });
        } catch (error) {
          console.error("Error al reiniciar el progreso:", error);
          showAlert({
            message: "Error al reiniciar el progreso",
            severity: "error",
          });
        }
      },
    });
  };

  const handleUnitClick = (unitId) => {
    setExpandedUnit(expandedUnit === unitId ? null : unitId);
    setActiveUnit(unitId);

    // Encontrar la unidad seleccionada
    const selectedUnit = units.find((unit) => unit.id === unitId);

    // Establecer los temas de esta unidad
    if (selectedUnit && selectedUnit.temas) {
      setTopics(selectedUnit.temas);

      // Resetear el tema y la tarea
      setExpandedTopic(null);
      setActiveTopic(null);
      setActiveTask(null);

      // Si hay temas, activar el primero
      if (selectedUnit.temas.length > 0) {
        const firstTopic = selectedUnit.temas[0];
        setExpandedTopic(firstTopic.id);
        setActiveTopic(firstTopic.id);

        // Establecer tareas del primer tema
        if (firstTopic.tareas) {
          setTasks(firstTopic.tareas);
          if (firstTopic.tareas.length > 0) {
            setActiveTask(firstTopic.tareas[0].id);
          }
        }
      }
    }
  };

  const handleTopicClick = (topicId) => {
    setExpandedTopic(expandedTopic === topicId ? null : topicId);
    setActiveTopic(topicId);

    // Encontrar el tema seleccionado
    const selectedTopic = topics.find((topic) => topic.id === topicId);

    // Establecer las tareas de este tema
    if (selectedTopic && selectedTopic.tareas) {
      setTasks(selectedTopic.tareas);

      // Activar la primera tarea si existe
      if (selectedTopic.tareas.length > 0) {
        setActiveTask(selectedTopic.tareas[0].id);
      } else {
        setActiveTask(null);
      }
    }
  };

  const handleTaskClick = (taskId) => {
    setActiveTask(taskId);
  };

  const goBack = () => {
    onBack();
  };

  // Calcular el porcentaje de tareas completadas para una unidad
  const calculateUnitProgress = (unitId) => {
    if (!progressData) return 0;

    const unidad = progressData.unidades.find((u) => u.id === unitId);
    if (!unidad) return 0;

    let totalTasks = 0;
    let completedTasks = 0;

    unidad.temas.forEach((tema) => {
      tema.tareas.forEach((tarea) => {
        totalTasks++;
        if (tarea.completada) {
          completedTasks++;
        }
      });
    });

    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  // Calcular el porcentaje de tareas completadas para un tema
  const calculateTopicProgress = (topicId) => {
    if (!progressData) return 0;

    // Buscar el tema en todas las unidades
    let tema = null;
    progressData.unidades.some((unidad) => {
      tema = unidad.temas.find((t) => t.id === topicId);
      return tema !== undefined;
    });

    if (!tema) return 0;

    let totalTasks = tema.tareas.length;
    let completedTasks = tema.tareas.filter((tarea) => tarea.completada).length;

    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  // Verificar si una tarea está completada
  const isTaskCompleted = (taskId) => {
    return userProgress.includes(taskId);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
        }}
      >
        <CircularProgress sx={{ color: theme.primary, mb: 2 }} />
        <Typography variant="h6" color="textSecondary">
          Cargando contenido del curso...
        </Typography>
      </Box>
    );
  }

  // Si no hay curso o unidades, mostrar mensaje
  if (!course) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5" color="textSecondary" gutterBottom>
          No se encontró información para este curso
        </Typography>
        <StyledButton onClick={goBack} startIcon={<ArrowBack />}>
          Volver a mis cursos
        </StyledButton>
      </Box>
    );
  }

  // Encontrar la tarea activa
  const activeTaskData = tasks.find((task) => task.id === activeTask);

  return (
    <Box sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh", pt: 3, pb: 8 }}>
      <Container maxWidth="xl">
        {/* Cabecera del curso */}
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link
              underline="hover"
              color="inherit"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                goBack();
              }}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Home sx={{ mr: 0.5 }} fontSize="inherit" />
              Inicio
            </Link>
            <Link
              underline="hover"
              color="inherit"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                goBack();
              }}
            >
              Mis Cursos
            </Link>
            <Typography color="text.primary">{course.nombre}</Typography>
          </Breadcrumbs>

          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  backgroundImage: "linear-gradient(90deg, #333333, #666666)",
                  backgroundClip: "text",
                  color: "transparent",
                  WebkitBackgroundClip: "text",
                }}
              >
                {course.nombre}
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 2, color: theme.secondary, fontSize: "1.1rem" }}
              >
                {course.descripcion}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                {course.profesor && (
                  <Chip
                    label={`Instructor: ${course.profesor.nombre}`}
                    sx={{
                      backgroundColor: "rgba(0,0,0,0.05)",
                      fontWeight: 500,
                      "& .MuiChip-label": { px: 2, py: 0.5 },
                    }}
                  />
                )}
                <Chip
                  label={`${units.length} Unidades`}
                  sx={{
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    color: theme.blue,
                    fontWeight: 500,
                    "& .MuiChip-label": { px: 2, py: 0.5 },
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Tu progreso
                </Typography>

                {loadingProgress ? (
                  <CircularProgress size={24} sx={{ color: theme.primary }} />
                ) : isEnrolled ? (
                  <>
                    <Box sx={{ mb: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          Progreso del curso
                        </Typography>
                        <Typography variant="body2" fontWeight="500">
                          {courseProgress}%
                        </Typography>
                      </Box>
                      <ProgressContainer value={courseProgress} />
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Estado
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {courseProgress === 100
                            ? "Completado"
                            : "En progreso"}
                        </Typography>
                      </Box>
                      <Box>
                        <StyledButton
                          size="small"
                          variant="secondary"
                          onClick={handleResetProgress}
                          sx={{
                            borderColor: theme.error,
                            color: theme.error,
                            "&:hover": {
                              backgroundColor: "rgba(239, 68, 68, 0.1)",
                            },
                          }}
                        >
                          Reiniciar
                        </StyledButton>
                      </Box>
                    </Box>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No estás inscrito en este curso. Inscríbete para rastrear tu
                    progreso.
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Contenido principal */}
        <Grid container spacing={4}>
          {/* Sidebar con unidades y temas */}
          <Grid item xs={12} md={3}>
            <Box sx={{ position: "sticky", top: "20px" }}>
              <SectionTitle variant="h5">Contenido del curso</SectionTitle>

              <Box sx={{ mb: 4 }}>
                {units.map((unit, index) => {
                  const isExpanded = expandedUnit === unit.id;
                  const isActive = activeUnit === unit.id;
                  const unitTopics = unit.temas || [];
                  const unitProgress = calculateUnitProgress(unit.id);
                  const unitCompleted = unitProgress === 100;

                  return (
                    <Box key={unit.id} sx={{ mb: 2 }}>
                      <UnitCard
                        active={isActive}
                        completed={unitCompleted}
                        onClick={() => handleUnitClick(unit.id)}
                        sx={{ cursor: "pointer" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600 }}
                            >
                              Unidad {index + 1}: {unit.nombre}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {unitTopics.length} temas
                            </Typography>

                            {isEnrolled && (
                              <Box sx={{ mt: 1 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 0.5,
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    color={
                                      unitCompleted
                                        ? theme.success
                                        : "textSecondary"
                                    }
                                  >
                                    {unitProgress}% completado
                                  </Typography>
                                </Box>
                                <ProgressContainer value={unitProgress} />
                              </Box>
                            )}
                          </Box>
                          <IconButton size="small">
                            {isExpanded ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </Box>
                      </UnitCard>

                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box sx={{ ml: 2, mt: 1 }}>
                          {unitTopics.map((topic, topicIndex) => {
                            const isTopicExpanded = expandedTopic === topic.id;
                            const isTopicActive = activeTopic === topic.id;
                            const topicTasks = topic.tareas || [];
                            const topicProgress = calculateTopicProgress(
                              topic.id
                            );
                            const topicCompleted = topicProgress === 100;

                            return (
                              <Box key={topic.id} sx={{ mb: 1 }}>
                                <TopicCard
                                  active={isTopicActive}
                                  completed={topicCompleted}
                                  onClick={() => handleTopicClick(topic.id)}
                                  sx={{ cursor: "pointer" }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Box sx={{ flexGrow: 1 }}>
                                      <Typography
                                        variant="body1"
                                        sx={{
                                          fontWeight: isTopicActive ? 600 : 500,
                                        }}
                                      >
                                        {topic.nombre}
                                      </Typography>

                                      {isEnrolled && (
                                        <Box sx={{ mt: 1, width: "100%" }}>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                              mb: 0.5,
                                            }}
                                          >
                                            <Typography
                                              variant="caption"
                                              color={
                                                topicCompleted
                                                  ? theme.success
                                                  : "textSecondary"
                                              }
                                            >
                                              {topicProgress}% completado
                                            </Typography>
                                            <Typography
                                              variant="caption"
                                              color="textSecondary"
                                            >
                                              {topicTasks.length} tareas
                                            </Typography>
                                          </Box>
                                          <ProgressContainer
                                            value={topicProgress}
                                          />
                                        </Box>
                                      )}
                                    </Box>
                                    {topicTasks.length > 0 && (
                                      <IconButton size="small">
                                        {isTopicExpanded ? (
                                          <ExpandLess />
                                        ) : (
                                          <ExpandMore />
                                        )}
                                      </IconButton>
                                    )}
                                  </Box>
                                </TopicCard>

                                <Collapse
                                  in={isTopicExpanded}
                                  timeout="auto"
                                  unmountOnExit
                                >
                                  <Box sx={{ ml: 2, mt: 1 }}>
                                    {topicTasks.map((task) => {
                                      const isTaskActive =
                                        activeTask === task.id;
                                      const isTaskCompleted =
                                        userProgress.includes(task.id);

                                      return (
                                        <TaskCard
                                          key={task.id}
                                          type={task.tipo || "assignment"}
                                          completed={isTaskCompleted}
                                          onClick={() =>
                                            handleTaskClick(task.id)
                                          }
                                          sx={{ cursor: "pointer" }}
                                        >
                                          <Box
                                            sx={{
                                              mr: 1,
                                              color: isTaskCompleted
                                                ? theme.success
                                                : "inherit",
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            {isTaskCompleted ? (
                                              <CheckCircle
                                                sx={{ color: theme.success }}
                                              />
                                            ) : (
                                              getTaskIcon(task.tipo)
                                            )}
                                          </Box>
                                          <Box sx={{ flexGrow: 1 }}>
                                            <Typography
                                              variant="body2"
                                              sx={{
                                                fontWeight: isTaskActive
                                                  ? 600
                                                  : 400,
                                                color: isTaskCompleted
                                                  ? theme.success
                                                  : "inherit",
                                                textDecoration: isTaskCompleted
                                                  ? "line-through"
                                                  : "none",
                                                opacity: isTaskCompleted
                                                  ? 0.85
                                                  : 1,
                                              }}
                                            >
                                              {task.titulo}
                                            </Typography>
                                            {isTaskCompleted && (
                                              <Typography
                                                variant="caption"
                                                sx={{
                                                  color: theme.success,
                                                  display: "block",
                                                  mt: 0.5,
                                                }}
                                              >
                                                Completada
                                              </Typography>
                                            )}
                                          </Box>
                                          {isTaskCompleted && (
                                            <Chip
                                              icon={
                                                <CheckCircle fontSize="small" />
                                              }
                                              label="Completada"
                                              size="small"
                                              sx={{
                                                backgroundColor:
                                                  "rgba(34, 197, 94, 0.1)",
                                                color: theme.success,
                                                ml: 1,
                                                border:
                                                  "1px solid rgba(34, 197, 94, 0.3)",
                                                "& .MuiChip-icon": {
                                                  color: theme.success,
                                                  fontSize: "0.875rem",
                                                },
                                                "& .MuiChip-label": {
                                                  fontWeight: 600,
                                                  px: 1,
                                                },
                                              }}
                                            />
                                          )}
                                        </TaskCard>
                                      );
                                    })}
                                  </Box>
                                </Collapse>
                              </Box>
                            );
                          })}
                        </Box>
                      </Collapse>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Grid>

          {/* Área de contenido principal */}
          <Grid item xs={12} md={9}>
            {activeTaskData ? (
              <Box>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: "12px",
                    mb: 3,
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: "8px",
                        display: "flex",
                        mr: 2,
                        backgroundColor: "rgba(0,0,0,0.03)",
                      }}
                    >
                      {getTaskIcon(activeTaskData.tipo)}
                    </Box>
                    <Box>
                      <Chip
                        size="small"
                        label={getTaskTypeName(activeTaskData.tipo)}
                        sx={{
                          mb: 1,
                          backgroundColor:
                            activeTaskData.tipo === "video"
                              ? "rgba(239, 68, 68, 0.1)"
                              : activeTaskData.tipo === "quiz"
                              ? "rgba(139, 92, 246, 0.1)"
                              : activeTaskData.tipo === "reading"
                              ? "rgba(8, 145, 178, 0.1)"
                              : "rgba(245, 158, 11, 0.1)",
                          color:
                            activeTaskData.tipo === "video"
                              ? "#ef4444"
                              : activeTaskData.tipo === "quiz"
                              ? "#8b5cf6"
                              : activeTaskData.tipo === "reading"
                              ? "#0891b2"
                              : "#f59e0b",
                        }}
                      />
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {activeTaskData.titulo}
                      </Typography>
                    </Box>
                  </Box>

                  {isEnrolled && isTaskCompleted(activeTaskData.id) && (
                    <Box
                      sx={{
                        mb: 2,
                        mt: 1,
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        borderRadius: "8px",
                        backgroundColor: "rgba(34, 197, 94, 0.1)",
                        border: "1px solid rgba(34, 197, 94, 0.3)",
                      }}
                    >
                      <CheckCircle sx={{ color: theme.success, mr: 2 }} />
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600, color: theme.success }}
                        >
                          Tarea Completada
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Has completado esta tarea exitosamente.
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />
                  <Typography sx={{ mb: 3 }}>
                    {activeTaskData.descripcion}
                  </Typography>

                  {/* Contenido específico según tipo de tarea */}
                  {activeTaskData.tipo === "video" && (
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: 0,
                        paddingBottom: "56.25%", // 16:9 aspect ratio
                        mb: 3,
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
                      }}
                    >
                      <Paper
                        sx={{
                          backgroundColor: "#000",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                        }}
                      >
                        <Box sx={{ textAlign: "center" }}>
                          <PlayCircleOutline
                            sx={{ fontSize: 80, opacity: 0.8, mb: 2 }}
                          />
                          <Typography variant="body1">
                            Video del contenido del curso
                          </Typography>
                        </Box>
                      </Paper>
                    </Box>
                  )}

                  {activeTaskData.tipo === "quiz" && (
                    <Box sx={{ mb: 3 }}>
                      <Paper
                        sx={{
                          p: 3,
                          borderRadius: "12px",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ mb: 2, fontWeight: 600 }}
                        >
                          Cuestionario: {activeTaskData.titulo}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3 }}>
                          Completa este cuestionario para evaluar tu comprensión
                          del tema.
                        </Typography>
                        <StyledButton>Comenzar cuestionario</StyledButton>
                      </Paper>
                    </Box>
                  )}

                  {activeTaskData.tipo === "reading" && (
                    <Box sx={{ mb: 3 }}>
                      <Paper
                        sx={{
                          p: 3,
                          borderRadius: "12px",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ mb: 2, fontWeight: 600 }}
                        >
                          Material de lectura
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Nullam in dui mauris. Vivamus hendrerit arcu sed
                          erat molestie vehicula. Sed auctor neque eu tellus
                          rhoncus ut eleifend nibh porttitor. Ut in nulla enim.
                          Phasellus molestie magna non est bibendum non
                          venenatis nisl tempor.
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                          Suspendisse in justo eu magna luctus suscipit. Sed
                          lectus. Integer euismod lacus luctus magna. Quisque
                          cursus, metus vitae pharetra auctor, sem massa mattis
                          sem, at interdum magna augue eget diam. Vestibulum
                          ante ipsum primis in faucibus orci luctus et ultrices
                          posuere cubilia Curae.
                        </Typography>
                      </Paper>
                    </Box>
                  )}

                  {activeTaskData.tipo === "assignment" && (
                    <Box sx={{ mb: 3 }}>
                      <Paper
                        sx={{
                          p: 3,
                          borderRadius: "12px",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ mb: 2, fontWeight: 600 }}
                        >
                          Tarea: {activeTaskData.titulo}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3 }}>
                          Completa esta tarea y súbela para evaluación.
                        </Typography>
                      </Paper>
                    </Box>
                  )}

                  {isEnrolled && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 4,
                      }}
                    >
                      <Box>
                        {!userProgress.includes(activeTaskData.id) ? (
                          <StyledButton
                            onClick={() =>
                              handleMarkComplete(activeTaskData.id)
                            }
                            sx={{
                              backgroundColor: theme.success,
                              "&:hover": { backgroundColor: "#1ea34b" },
                            }}
                          >
                            Marcar como completada
                          </StyledButton>
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{
                              color: theme.success,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <CheckCircle sx={{ mr: 1 }} fontSize="small" />
                            Completada
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}
                </Paper>

                {/* Sección de recursos adicionales */}
              </Box>
            ) : (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h5" color="textSecondary" gutterBottom>
                  Selecciona una tarea para ver su contenido
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CourseContent;
