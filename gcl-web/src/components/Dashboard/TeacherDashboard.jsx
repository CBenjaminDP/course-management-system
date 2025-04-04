import { useState, useEffect } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  IconButton, 
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Chip,
  Divider,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon
} from "@mui/icons-material";
import Swal from 'sweetalert2';

const TeacherDashboard = () => {
  const theme = useTheme();
  
  // Estados
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Función para obtener headers con token
  const getAuthHeaders = () => {
    const token = Cookies.get('accessToken');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  // Obtener cursos
  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:8000/cursos/listar_cursos/', getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error al obtener cursos:', error);
      throw error;
    }
  };

  // Obtener profesores
  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/usuarios/profesores/', getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error al obtener profesores:', error);
      throw error;
    }
};

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesData, teachersData] = await Promise.all([
          fetchCourses(),
          fetchTeachers()
        ]);
        setCourses(coursesData);
        setTeachers(teachersData);
        setLoading(false);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setLoading(false);
        showSnackbar("Error al cargar los datos", "error");
      }
    };
    
    loadData();
  }, []);

  // Crear curso
  const createCourse = async (courseData) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/cursos/registrar_curso/', 
        courseData, 
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error al crear curso:', error);
      throw error;
    }
  };

  // Actualizar curso
  const updateCourse = async (id, courseData) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/cursos/actualizar_curso/${id}/`, 
        courseData, 
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar curso:', error);
      throw error;
    }
  };

  // Eliminar curso
  const deleteCourse = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/cursos/eliminar_curso/${id}/`, 
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error al eliminar curso:', error);
      throw error;
    }
  };

  // Manejadores de UI
  const handleOpenDialog = (course = null) => {
    setCurrentCourse(course
      ? {
          ...course,
          profesor: course.profesor?.id || course.profesor // Normaliza a un id
        }
      : {
          nombre: "",
          descripcion: "",
          profesor: "",
          fecha_inicio: "",
          fecha_fin: "",
          estado: true,
          imagen_url: ""
        }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentCourse(null);
  };

  const handleOpenDelete = (course) => {
    setCurrentCourse(course);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setCurrentCourse(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentCourse(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Manejador para enviar formulario
  const handleSubmit = async () => {
    try {
      if (currentCourse.id) {
        await updateCourse(currentCourse.id, currentCourse);
        const updatedCourses = await fetchCourses();
        setCourses(updatedCourses);
        showSnackbar("Curso actualizado con éxito", "success");
      } else {
        await createCourse(currentCourse);
        const updatedCourses = await fetchCourses();
        setCourses(updatedCourses);
        showSnackbar("Curso creado con éxito", "success");
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error al guardar curso:', error);
      const errorMsg = error.response?.data?.error || "Error al procesar la solicitud";
      showSnackbar(errorMsg, "error");
    }
  };

  // Manejador para eliminar curso
  const handleDelete = async () => {
    try {
      await deleteCourse(currentCourse.id);
      const updatedCourses = await fetchCourses();
      setCourses(updatedCourses);
      showSnackbar("Curso eliminado con éxito", "success");
      handleCloseDelete();
    } catch (error) {
      console.error('Error al eliminar curso:', error);
      showSnackbar("Error al eliminar el curso", "error");
    }
  };

  // Funciones auxiliares
  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No definida";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.username : "Profesor no asignado";
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Cargando...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: theme.palette.background.default }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
            Cursos
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Gestiona los cursos disponibles.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ px: 4, py: 1.5, borderRadius: 2 }}
        >
          Nuevo Curso
        </Button>
      </Box>

      {/* Grid de Cursos */}
      <Grid container spacing={3}>
        {courses.map(course => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 3,
              boxShadow: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6
              }
            }}>
              <Box sx={{ 
                height: 160, 
                backgroundImage: `url(${course.imagen_url || 'https://img.pikbest.com/backgrounds/20190715/summer-training-course-enrollment-hd-background_1898741.jpg!bw700'})`, 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                <Chip
                  label={course.estado ? "Activo" : "Inactivo"}
                  color={course.estado ? "success" : "error"}
                  size="small"
                  sx={{ 
                    position: 'absolute', 
                    top: 16, 
                    right: 16,
                    fontWeight: 600
                  }}
                />
              </Box>
              
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  {course.nombre}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PersonIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {getTeacherName(course.profesor?.id || course.profesor)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(course.fecha_inicio)} - {formatDate(course.fecha_fin)}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  {course.descripcion}
                </Typography>
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                <IconButton 
                  aria-label="editar"
                  onClick={() => handleOpenDialog(course)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  aria-label="eliminar"
                  onClick={() => handleOpenDelete(course)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal para Crear/Editar */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ 
          backgroundColor: theme.palette.primary.main, 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {currentCourse?.id ? "Editar Curso" : "Crear Nuevo Curso"}
          <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ py: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre del curso"
                name="nombre"
                value={currentCourse?.nombre || ""}
                onChange={handleInputChange}
                sx={{ mb: 3, mt: 3 }}
                variant="outlined"
                placeholder="Nombre del curso"
                required
              />
              
              <FormControl fullWidth sx={{ mb: 3 }}>
  <InputLabel>Profesor</InputLabel>
  <Select
    name="profesor"
    value={currentCourse?.profesor || ""} // Asegúrate de que sea un id
    onChange={(e) => setCurrentCourse((prev) => ({
      ...prev,
      profesor: e.target.value // Guarda solo el id del profesor
    }))}
    label="Profesor"
    required
  >
    {teachers.map((teacher) => (
      <MenuItem key={teacher.id} value={teacher.id}>
        {teacher.username}
      </MenuItem>
    ))}
  </Select>
</FormControl>
              
              <TextField
                fullWidth
                label="Fecha de inicio"
                name="fecha_inicio"
                type="date"
                value={currentCourse?.fecha_inicio || ""}
                onChange={handleInputChange}
                sx={{ mb: 3 }}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha de fin"
                name="fecha_fin"
                type="date"
                value={currentCourse?.fecha_fin || ""}
                onChange={handleInputChange}
                sx={{ mb: 3, mt: 3  }}
                InputLabelProps={{ shrink: true }}
                required
              />
              
              {currentCourse?.id && (
                <FormControlLabel
                  control={
                    <Checkbox
                      name="estado"
                      checked={currentCourse?.estado || false}
                      onChange={handleInputChange}
                      color="primary"
                    />
                  }
                  label="Curso activo"
                  sx={{ mb: 3 }}
                />
              )}
              
              <TextField
                fullWidth
                label="URL de la imagen"
                name="imagen_url"
                value={currentCourse?.imagen_url || ""}
                onChange={handleInputChange}
                sx={{ mb: 3 }}
                placeholder="URL de la imagen del curso"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                name="descripcion"
                value={currentCourse?.descripcion || ""}
                onChange={handleInputChange}
                multiline
                rows={4}
                placeholder="Descripción del curso"
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            disabled={!currentCourse?.nombre || !currentCourse?.descripcion || !currentCourse?.profesor || !currentCourse?.fecha_inicio || !currentCourse?.fecha_fin}
            startIcon={<CheckIcon />}
          >
            {currentCourse?.id ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para Eliminar */}
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ 
          backgroundColor: theme.palette.error.main, 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          Confirmar Eliminación
          <IconButton onClick={handleCloseDelete} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ py: 4, px: 3 }}>
          <DialogContentText
            sx={{ mb: 2, mt: 2 }}>
            ¿Estás seguro que deseas eliminar el curso <strong>"{currentCourse?.nombre}"</strong>? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleCloseDelete}
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDelete}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TeacherDashboard;