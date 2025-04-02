import { useState, useContext } from "react";
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  useTheme,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper
} from "@mui/material";
import { 
  CalendarToday,
  Person,
  CheckCircle,
  Cancel,
  School,
  Description
} from "@mui/icons-material";
import { AuthContext } from "@/context/AuthorizationProvider";

const TeacherDashboard = () => {
  const theme = useTheme();
  const { user } = useContext(AuthContext);
  
  // Datos hardcodeados de cursos del profesor actual
  const teacherCourses = [
    {
      id: 1,
      nombre: "Matemáticas Avanzadas",
      descripcion: "Curso de cálculo diferencial e integral para estudiantes de ingeniería.",
      profesor: { id: 1, nombre: "Prof. García" },
      fecha_inicio: "2023-09-01",
      fecha_fin: "2023-12-15",
      estado: true,
      imagen: "https://sistemas.fciencias.unam.mx/~rich/MAF/imagenes/MAF_portada_web.jpg"
    },
    {
      id: 2,
      nombre: "Programación Web",
      descripcion: "Aprende desarrollo web con React, Node.js y MongoDB.",
      profesor: { id: 1, nombre: "Prof. García" },
      fecha_inicio: "2023-10-01",
      fecha_fin: "2023-12-20",
      estado: true,
      imagen: "https://www.ucatalunya.edu.co/img/blog/que-es-el-desarrollo-web-full-stack-y-por-que-es-una-de-las-profesiones-mas-demandadas-del-mercado-en-aplicaciones-web.jpg"
    },
    {
      id: 3,
      nombre: "Historia del Arte",
      descripcion: "Recorrido por los movimientos artísticos más importantes del siglo XX.",
      profesor: { id: 1, nombre: "Prof. García" },
      fecha_inicio: "2023-09-15",
      fecha_fin: "2023-11-30",
      estado: false,
      imagen: "https://sobrehisteria.wordpress.com/wp-content/uploads/2014/10/foto_historia.jpg?w=640"
    }
  ];

  // Estados para el modal de detalle
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Manejadores para el modal de detalle
  const handleOpenDetail = (course) => {
    setSelectedCourse(course);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedCourse(null);
  };

  return (
    <Box sx={{ 
      p: 4,
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* Contenedor principal con fondo blanco */}
      <Paper elevation={0} sx={{ 
        p: 4,
        borderRadius: 2,
        backgroundColor: 'white'
      }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700,
            color: theme.palette.primary.main,
            mb: 1
          }}>
            Mis Cursos
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Bienvenido, Profesor
          </Typography>
        </Box>

        {/* Grid de Cursos */}
        <Grid container spacing={3}>
          {teacherCourses.map(course => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card 
                onClick={() => handleOpenDetail(course)}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[6]
                  }
                }}
              >
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
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {course.descripcion.substring(0, 100)}...
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(course.fecha_inicio)} - {formatDate(course.fecha_fin)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Modal de Detalle del Curso */}
      <Dialog
        open={openDetail}
        onClose={handleCloseDetail}
        fullWidth
        maxWidth="sm"
        PaperProps={{ 
          sx: { 
            borderRadius: 3,
            backgroundColor: 'white'
          } 
        }}
      >
        {selectedCourse && (
          <>
            <DialogTitle sx={{ 
              backgroundColor: theme.palette.primary.main, 
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              {selectedCourse.nombre}
              <Chip
                label={selectedCourse.estado ? "Activo" : "Inactivo"}
                color={selectedCourse.estado ? "success" : "error"}
                sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }}
              />
            </DialogTitle>
            
            <DialogContent sx={{ py: 4 }}>
              <Box sx={{ 
                height: 200,
                backgroundImage: `url(${selectedCourse.imagen})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 2,
                mb: 3,
                mt: 3
              }} />
              
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Descripción
              </Typography>
              <Typography paragraph>
                {selectedCourse.descripcion}
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Person color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Profesor" 
                    secondary={selectedCourse.profesor.nombre} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Fecha de inicio" 
                    secondary={formatDate(selectedCourse.fecha_inicio)} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Fecha de fin" 
                    secondary={formatDate(selectedCourse.fecha_fin)} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    {selectedCourse.estado ? (
                      <CheckCircle color="success" />
                    ) : (
                      <Cancel color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary="Estado" 
                    secondary={selectedCourse.estado ? "Activo" : "Inactivo"} 
                  />
                </ListItem>
              </List>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default TeacherDashboard;