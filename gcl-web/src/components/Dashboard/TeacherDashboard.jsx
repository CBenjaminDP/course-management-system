import { useState } from "react";
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
  Avatar,
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
  School as SchoolIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon
} from "@mui/icons-material";

const TeacherDashboard = () => {
  const theme = useTheme();
  
  // Datos hardcodeados de profesores para el select
  const teachers = [
    { id: 1, name: "Prof. García" },
    { id: 2, name: "Prof. Martínez" },
    { id: 3, name: "Prof. Rodríguez" }
  ];

  // Estado inicial de los cursos
  const [courses, setCourses] = useState([
    {
      id: 1,
      nombre: "Matemáticas Avanzadas",
      descripcion: "Curso de cálculo diferencial e integral para estudiantes de ingeniería.",
      profesor: 1,
      fecha_inicio: "2023-09-01",
      fecha_fin: "2023-12-15",
      estado: true,
      imagen: "https://sistemas.fciencias.unam.mx/~rich/MAF/imagenes/MAF_portada_web.jpg"
    },
    {
      id: 2,
      nombre: "Programación Web",
      descripcion: "Aprende desarrollo web con React, Node.js y MongoDB.",
      profesor: 2,
      fecha_inicio: "2023-10-01",
      fecha_fin: "2023-12-20",
      estado: true,
      imagen: "https://www.ucatalunya.edu.co/img/blog/que-es-el-desarrollo-web-full-stack-y-por-que-es-una-de-las-profesiones-mas-demandadas-del-mercado-en-aplicaciones-web.jpg"
    },
    {
      id: 3,
      nombre: "Historia del Arte",
      descripcion: "Recorrido por los movimientos artísticos más importantes del siglo XX.",
      profesor: 3,
      fecha_inicio: "2023-09-15",
      fecha_fin: "2023-11-30",
      estado: false,
      imagen: "https://sobrehisteria.wordpress.com/wp-content/uploads/2014/10/foto_historia.jpg?w=640"
    }
  ]);

  // Estados para los modales
  const [openDialog, setOpenDialog] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Manejadores para el modal de creación/edición
  const handleOpenDialog = (course = null) => {
    setCurrentCourse(course || {
      nombre: "",
      descripcion: "",
      profesor: "",
      fecha_inicio: "",
      fecha_fin: "",
      estado: false
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentCourse(null);
  };

  // Manejadores para el modal de eliminación
  const handleOpenDelete = (course) => {
    setCurrentCourse(course);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setCurrentCourse(null);
  };

  // Manejador de cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentCourse(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Manejadores para las acciones CRUD
  const handleSubmit = () => {
    if (currentCourse.id) {
      // Actualizar curso existente
      setCourses(courses.map(c => c.id === currentCourse.id ? currentCourse : c));
      showSnackbar("Curso actualizado con éxito", "success");
    } else {
      // Crear nuevo curso
      const newCourse = {
        ...currentCourse,
        id: Math.max(...courses.map(c => c.id)) + 1,
        imagen: "https://img.pikbest.com/backgrounds/20190715/summer-training-course-enrollment-hd-background_1898741.jpg!bw700"
      };
      setCourses([...courses, newCourse]);
      showSnackbar("Curso creado con éxito", "success");
    }
    handleCloseDialog();
  };

  const handleDelete = () => {
    // Eliminar curso
    setCourses(courses.filter(c => c.id !== currentCourse.id));
    showSnackbar("Curso eliminado con éxito", "success");
    handleCloseDelete();
  };

  // Manejador del snackbar
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

  // Formatear fecha para mostrarla
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: theme.palette.background.default }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
            Cursos
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Crea nuevos cursos para tus estudiantes.
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
                backgroundImage: `url(${course.imagen})`, 
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
                    {teachers.find(t => t.id === course.profesor)?.name || "Profesor no asignado"}
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
              />
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Profesor</InputLabel>
                <Select
                  name="profesor"
                  value={currentCourse?.profesor || ""}
                  onChange={handleInputChange}
                  label="Profesor"
                >
                  {teachers.map(teacher => (
                    <MenuItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
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
              />
              
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
            disabled={!currentCourse?.nombre || !currentCourse?.descripcion}
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