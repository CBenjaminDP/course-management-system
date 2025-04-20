import React, { useState, useEffect } from 'react';
import { 
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  CircularProgress,
  CardMedia
} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

const Courses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = Cookies.get('accessToken');
        const headers = {
          'Authorization': `Bearer ${token}`
        };

        const userResponse = await axios.get('http://localhost:8000/usuarios/usuario-actual/', {
          headers
        });
        setCurrentUser(userResponse.data);

        const inscripcionesResponse = await axios.get('http://localhost:8000/inscripciones/', {
          headers
        });

        const misInscripciones = inscripcionesResponse.data.filter(
          inscripcion => inscripcion.id_usuario === userResponse.data.id
        );

        const cursosResponse = await axios.get('http://localhost:8000/cursos/listar_cursos/', {
          headers
        });

        const misCursos = misInscripciones.map(inscripcion => {
          const cursoInfo = cursosResponse.data.find(curso => curso.id === inscripcion.id_curso);
          if (cursoInfo) {
            return {
              ...cursoInfo,
              fechaInscripcion: inscripcion.fecha_inscripcion,
              inscripcionId: inscripcion.id
            };
          }
          return null;
        }).filter(curso => curso !== null);

        setEnrolledCourses(misCursos);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los cursos');
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mis Cursos
      </Typography>
      
      <Grid container spacing={3}>
        {enrolledCourses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.inscripcionId}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'all 0.3s ease-in-out',
                borderRadius: '15px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.2)',
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={'https://via.placeholder.com/300x200'}
                alt={course.nombre}
                sx={{ 
                  borderTopLeftRadius: '15px', 
                  borderTopRightRadius: '15px',
                  objectFit: 'cover'
                }}
              />
              <CardContent sx={{ 
                flexGrow: 1, 
                padding: '2rem',
                backgroundColor: '#ffffff',
                '&:last-child': { paddingBottom: '2rem' }
              }}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: '600',
                    color: '#2c3e50',
                    mb: 2
                  }}
                >
                  {course.nombre}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#666',
                    mb: 2,
                    lineHeight: 1.6
                  }}
                >
                  {course.descripcion}
                </Typography>
                <Typography 
                  sx={{ 
                    color: '#34495e',
                    fontWeight: '500',
                    mb: 1
                  }}
                >
                  Instructor: {course.profesor.nombre}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#7f8c8d',
                    fontStyle: 'italic'
                  }}
                >
                  Inscrito desde: {new Date(course.fechaInscripcion).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {enrolledCourses.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body1">
            You are not enrolled in any courses yet.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Courses;
