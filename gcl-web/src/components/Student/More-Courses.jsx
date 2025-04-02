import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, CardMedia, Button, Box, GlobalStyles, useMediaQuery, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

// Estilos globales para eliminar márgenes y rellenos predeterminados
const globalStyles = (
  <GlobalStyles
    styles={{
      body: { margin: 0, padding: 0 },
      html: { margin: 0, padding: 0 },
    }}
  />
);

// Datos de los cursos
const coursesData = [
  {
    id: 1,
    title: 'Introduction to React',
    description:
      'Learn the fundamentals of React including components, props, and state management.',
    instructor: 'John Doe',
    imageUrl: 'https://blog.wildix.com/wp-content/uploads/2020/06/react-logo.jpg',
  },
  {
    id: 2,
    title: 'Advanced JavaScript',
    description:
      'Deep dive into JavaScript concepts including closures, promises, and async/await.',
    instructor: 'Jane Smith',
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTvTsaCQ0AVQCJQ_rq-jkfT40f03me0dOq9g&s',
  },
  {
    id: 3,
    title: 'Python for Beginners',
    description: 'Start your programming journey with Python fundamentals.',
    instructor: 'Mike Johnson',
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYZqZkpMyiN2uSuT7GAf6JSkJ44YsZqoQHdw&s',
  },
  {
    id: 4,
    title: 'Mastering Node.js',
    description:
      'Build scalable and efficient server-side applications with Node.js.',
    instructor: 'Emily Davis',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1200px-Node.js_logo.svg.png',
  },
  {
    id: 5,
    title: 'Data Science with Python',
    description:
      'Learn data analysis, visualization, and machine learning using Python.',
    instructor: 'Carlos Martinez',
    imageUrl: 'https://www.mygreatlearning.com/blog/wp-content/uploads/2019/09/What-is-data-science-2.jpg',
  },
  {
    id: 6,
    title: 'Full-Stack Development with MERN',
    description:
      'Build full-stack applications using MongoDB, Express, React, and Node.js.',
    instructor: 'Laura Wilson',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2Zv4b0ta-yl_Dh7dOotkZ05ffe4Zltf6olA&s',
  },
  {
    id: 7,
    title: 'AWS for Developers',
    description:
      'Learn how to deploy and manage applications on Amazon Web Services.',
    instructor: 'David Brown',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/AmazonWebservices_Logo.svg/1200px-AmazonWebservices_Logo.svg.png',
  },
  {
    id: 8,
    title: 'UI/UX Design Fundamentals',
    description:
      'Master the principles of user interface and user experience design.',
    instructor: 'Sophia Lee',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShWTjtb-M7Pl6gAIh65hpVTlEO1ADh0E-2dg&s',
  },
  {
    id: 9,
    title: 'Mobile App Development with Flutter',
    description:
      'Build cross-platform mobile apps using Flutter and Dart.',
    instructor: 'Michael Taylor',
    imageUrl: 'https://miro.medium.com/v2/resize:fit:1200/1*5-aoK8IBmXve5whBQM90GA.png',
  },
  {
    id: 10,
    title: 'Cybersecurity Essentials',
    description:
      'Learn the basics of cybersecurity and how to protect your systems.',
    instructor: 'Olivia Garcia',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9XLPEVzFpsva3WCH0x9-5ZTpAdyZD9QIYHw&s',
  },
  {
    id: 11,
    title: 'DevOps with Docker and Kubernetes',
    description:
      'Learn how to automate and manage your infrastructure with Docker and Kubernetes.',
    instructor: 'James Wilson',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXAyq-Fkotzz94UroKJq8lb320rFxPQcvn-g&s',
  },
];

// Add this to your imports
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, TextField } from '@mui/material';

const MoreCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [currentUser, setCurrentUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = Cookies.get('accessToken');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Obtener usuario actual
      const userResponse = await axios.get('http://localhost:8000/usuarios/usuario-actual/', { headers });
      setCurrentUser(userResponse.data);

      // Obtener inscripciones
      const inscripcionesResponse = await axios.get('http://localhost:8000/inscripciones/', { headers });
      const misInscripciones = inscripcionesResponse.data.filter(
        inscripcion => inscripcion.id_usuario === userResponse.data.id
      );
      setEnrolledCourses(misInscripciones.map(insc => insc.id_curso));  

      // Obtener cursos
      const cursosResponse = await axios.get('http://localhost:8000/cursos/listar_cursos', { headers });
      setCourses(cursosResponse.data);
      setLoading(false);
    } catch (error) {
      setAlert({
        open: true,
        message: 'Error al cargar los datos',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleEnrollment = async (courseId) => {
    try {
      const token = Cookies.get('accessToken');
      
      const inscripcionData = {
        id_usuario: currentUser.id,
        id_curso: courseId,
        fecha_inscripcion: new Date().toISOString().split('T')[0]
      };

      await axios.post('http://localhost:8000/inscripciones/registrar/',
        inscripcionData,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      setEnrolledCourses([...enrolledCourses, courseId]);

      setAlert({
        open: true,
        message: '¡Inscripción exitosa!',
        severity: 'success'
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.response?.data?.error || 'Error al inscribirse al curso',
        severity: 'error'
      });
    }
  };

  // Add this new state
  const [searchTerm, setSearchTerm] = useState('');

  // Add this filter function
  const filteredCourses = courses.filter(course => 
    course.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.profesor.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {globalStyles}
      <Box>
        <Container sx={{ py: 8 }} maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 4, 
            mb: 4 
          }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: '600', color: '#333' }}>
              Cursos Disponibles
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search courses by name, description or instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                maxWidth: '600px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: '#fff',
                  '&:hover': {
                    '& > fieldset': { borderColor: '#007BFF' }
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
          </Box>

          <Grid container spacing={4}>
            {filteredCourses.map((course) => (
              <Grid item key={course.id} xs={12} sm={6} md={4}>
                <Card sx={{ 
                  height: '100%',
                  transition: 'all 0.3s ease-in-out',
                  borderRadius: '15px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.2)',
                  }
                }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={course.imageUrl || 'URL_imagen_por_defecto'}
                    alt={course.nombre}
                    sx={{ 
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                  <CardContent sx={{ 
                    flexGrow: 1, 
                    padding: '2rem',
                    backgroundColor: '#ffffff',
                    borderTop: '1px solid rgba(0,0,0,0.05)'
                  }}>
                    <Typography 
                      gutterBottom 
                      variant="h5" 
                      component="h2" 
                      sx={{ 
                        fontWeight: '600',
                        color: '#2c3e50',
                        mb: 2,
                        fontSize: '1.5rem'
                      }}
                    >
                      {course.nombre}
                    </Typography>
                    <Typography 
                      sx={{ 
                        color: '#666',
                        fontSize: '1rem',
                        lineHeight: 1.6,
                        mb: 2,
                        height: '4.8em',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {course.descripcion}
                    </Typography>
                    <Typography 
                      sx={{ 
                        color: '#34495e',
                        fontWeight: '500',
                        mb: 2
                      }}
                    >
                      Instructor: {course.profesor.nombre}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => handleEnrollment(course.id)}
                      disabled={enrolledCourses.includes(course.id)}
                      fullWidth
                      sx={{
                        mt: 2,
                        py: 1.5,
                        textTransform: 'none',
                        borderRadius: '10px',
                        fontWeight: '500',
                        backgroundColor: enrolledCourses.includes(course.id) ? '#FFA500' : '#007BFF',
                        '&:hover': {
                          backgroundColor: enrolledCourses.includes(course.id) ? '#FF8C00' : '#0056b3',
                          transform: 'scale(1.02)',
                        },
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      {enrolledCourses.includes(course.id) ? 'Inscrito' : 'Inscribirse'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {filteredCourses.length === 0 && (
            <Box sx={{ 
              textAlign: 'center', 
              mt: 4,
              p: 3,
              bgcolor: '#f5f5f5',
              borderRadius: 2
            }}>
              <Typography variant="h6" color="text.secondary">
                No courses found matching your search
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MoreCourses;