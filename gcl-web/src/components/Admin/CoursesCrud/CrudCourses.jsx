import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Tabs,
  Tab,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme
} from '@mui/material';
import { 
  Add, 
  Refresh, 
  Edit, 
  Delete,
  CalendarToday,
  Person,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useAlert } from '../../../context/AlertContext'; // Import the alert context
import ModalCreateCourse from './ModalCreateCourse';
import ModalUpdateCourse from './ModalUpdateCourse';

// Define theme colors to match login
const theme = {
  primary: "#FFD700", // Gold
  secondary: "#4A4A4A",
  text: "#333333",
  hover: "#E6C200",
  background: "#f8f9fa",
};

const CrudCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTab, setSelectedTab] = useState('grid');
  const [openDetail, setOpenDetail] = useState(false);
  const muiTheme = useTheme(); // This is the Material UI theme with shadows
  const { showAlert, showConfirmation } = useAlert(); // Use the alert context

  const fetchCourses = async () => {
    try {
      const token = Cookies.get('accessToken');
      if (!token) {
        // Redirect to login if no token
        window.location.href = '/login';
        return;
      }
  
      const response = await axios.get('http://localhost:8000/cursos/listar_cursos/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      if (error.response?.status === 401) {
        // Handle unauthorized (token expired/invalid)
        Cookies.remove('accessToken');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const handleOpenDetail = (course) => {
    setSelectedCourse(course);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };

  const handleCreateCourse = (newCourse) => {
    console.log('Creating course:', newCourse);
  };

  const handleUpdateCourse = async (id, updatedData) => {
    try {
      const token = Cookies.get('accessToken');
      await axios.put(`http://localhost:8000/cursos/actualizar_curso/${id}/`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchCourses(); // Refresh the course list
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    // Replace SweetAlert2 with the alert context
    showConfirmation({
      title: '¿Estás seguro?',
      message: "¡No podrás revertir esto!",
      onConfirm: async () => {
        try {
          const token = Cookies.get('accessToken');
          await axios.delete(`http://localhost:8000/cursos/eliminar_curso/${courseId}/`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          showAlert({
            message: 'El curso ha sido eliminado.',
            severity: 'success'
          });
          
          fetchCourses(); // Refresh the list
        } catch (error) {
          showAlert({
            message: 'No se pudo eliminar el curso',
            severity: 'error'
          });
        }
      }
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Update styles to match gold theme
  const styles = {
    card: {
      margin: '24px',
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
      borderRadius: '16px'
    },
    header: {
      backgroundColor: theme.primary,
      color: theme.text,
      borderRadius: '12px 12px 0 0'
    },
    addButton: {
      margin: '16px',
      backgroundColor: theme.primary,
      color: theme.text,
      borderRadius: '20px',
      padding: '8px 24px',
      '&:hover': {
        backgroundColor: theme.hover,
        boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)',
      }
    },
    refreshButton: {
      margin: '0 8px',
      backgroundColor: theme.secondary,
      color: '#ffffff',
      borderRadius: '20px',
      '&:hover': {
        backgroundColor: '#333333',
        transform: 'rotate(180deg)',
        transition: 'transform 0.5s',
      }
    },
    tableHeader: {
      backgroundColor: theme.background,
    },
    tableHeaderCell: {
      fontWeight: 600,
      color: theme.secondary,
      padding: '16px',
    },
    tableRow: {
      "&:nth-of-type(odd)": {
        backgroundColor: '#fafafa',
      },
      "&:hover": {
        backgroundColor: '#f5f5f5',
      },
      transition: "background-color 0.2s",
    },
    tableCell: {
      padding: '16px',
    },
    editButton: {
      color: theme.primary,
      '&:hover': {
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
      }
    },
    deleteButton: {
      color: '#ff5252',
      '&:hover': {
        backgroundColor: 'rgba(255, 82, 82, 0.1)',
      }
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Card sx={styles.card}>
        <CardHeader
          title="Gestión de Cursos"
          titleTypographyProps={{ variant: 'h5' }}
          sx={styles.header}
          action={
            <Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenCreateModal(true)}
                sx={styles.addButton}
              >
                Agregar Curso
              </Button>
              <IconButton
                onClick={fetchCourses}
                sx={styles.refreshButton}
              >
                <Refresh style={{ color: '#fff' }} />
              </IconButton>
            </Box>
          }
        />
        <CardContent>
          <Tabs
            value={selectedTab}
            onChange={(_, newValue) => setSelectedTab(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab label="Vista de Cuadrícula" value="grid" />
            <Tab label="Vista de Tabla" value="table" />
          </Tabs>

          {selectedTab === 'grid' ? (
            <Grid container spacing={3}>
              {courses.map(course => (
                <Grid item xs={12} sm={6} md={4} key={course.id}>
                  <Card 
                    onClick={() => handleOpenDetail(course)}
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: muiTheme.shadows[6] // Use muiTheme instead of theme
                      }
                    }}>
                      <Box sx={{ 
                        height: 160,
                        backgroundImage: course.imagen_url ? `url(${course.imagen_url})` : 'none',
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
                        <Typography variant="body2" color="text.secondary">
                          <strong>Prof.</strong> {course.profesor?.nombre || 'Sin asignar'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                          {formatDate(course.fecha_inicio)} - {formatDate(course.fecha_fin)}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {course.descripcion?.substring(0, 100)}...
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCourse(course);
                              setOpenUpdateModal(true);
                            }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCourse(course.id);
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
              ))}
            </Grid>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="courses table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>Nombre</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>Descripción</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>Profesor</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>{course.nombre}</TableCell>
                      <TableCell>{course.descripcion}</TableCell>
                      <TableCell>{course.profesor?.nombre || 'Sin asignar'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={course.estado ? "Activo" : "Inactivo"} 
                          color={course.estado ? "success" : "error"} 
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          sx={{ color: '#1976d2' }}
                          onClick={() => {
                            setSelectedCourse(course);
                            setOpenUpdateModal(true);
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          sx={{ color: '#d32f2f' }}
                          onClick={() => handleDeleteCourse(course.id)}
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
      </Card>

      {/* Detail Dialog */}
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
              backgroundColor: theme.primary, // Changed from theme.palette.primary.main
              color: theme.text, // Changed from 'white'
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
                backgroundColor: theme.primary, // Changed from theme.palette.primary.main
                backgroundImage: selectedCourse.imagen_url ? `url(${selectedCourse.imagen_url})` : 'none',
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
                    secondary={selectedCourse.profesor?.nombre || 'Sin asignar'} 
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

      {/* Keep existing modals */}
      <ModalCreateCourse
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onCreate={fetchCourses}  // This ensures the list refreshes after creation
      />

      <ModalUpdateCourse
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        onUpdate={fetchCourses}
        course={selectedCourse}
      />
    </Box>
  );
};

export default CrudCourses;
