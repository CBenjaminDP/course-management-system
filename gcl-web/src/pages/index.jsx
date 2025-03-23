import React from 'react';
import { Container, Grid, Card, CardContent, Typography, CardMedia, Button, AppBar, Toolbar, TextField, Box, InputAdornment, GlobalStyles, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';
import Carousel from 'react-material-ui-carousel';

// Estilos globales para eliminar márgenes y rellenos predeterminados
const globalStyles = (
  <GlobalStyles
    styles={{
      body: { margin: 0, padding: 0 },
      html: { margin: 0, padding: 0 },
    }}
  />
);

// Datos del carrusel
const carouselItems = [
  {
    id: 1,
    imageUrl: 'https://process.fs.teachablecdn.com/ADNupMnWyR7kCWRvm76Laz/resize=width:705/https://www.filepicker.io/api/file/fGWjtyQtG4JE7UXgaPAN',
    title: 'Aprende React desde cero',
    description: 'Inscríbete a nuestro curso de React y domina esta tecnología.',
    buttonText: 'Inscríbete ahora',
  },
  {
    id: 2,
    imageUrl: 'https://media.licdn.com/dms/image/v2/D5612AQGE9FIUbAJKTw/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1722439038008?e=2147483647&v=beta&t=39RlsrdyiTNM3fERIOFcBZLlKALaC0fTe23l2hSyz-M',
    title: 'JavaScript Avanzado',
    description: 'Domina conceptos avanzados como closures, promesas y async/await.',
    buttonText: 'Más información',
  },
  {
    id: 3,
    imageUrl: 'https://5.imimg.com/data5/SELLER/Default/2022/4/YT/WH/NR/151017895/python-course-500x500.jpg',
    title: 'Python para Principiantes',
    description: 'Comienza tu viaje en programación con Python.',
    buttonText: 'Ver curso',
  },
];

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

const HomePage = () => {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width:600px)'); // Detecta si es móvil

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleRegisterClick = () => {
    router.push('/register');
  };

  return (
    <>
      {globalStyles}
      <Box
        sx={{
          backgroundImage: 'url()',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Navbar */}
        <AppBar
          position="static"
          sx={{
            backgroundColor: 'white',
            color: 'black',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: '0',
            width: '100%',
          }}
        >
          <Toolbar>
            {/* Logo */}
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <img
                src="/logo_nav.png"
                alt="Logo"
                style={{ height: isMobile ? '50px' : '90px', marginRight: isMobile ? '16px' : '86px' }}
              />
            </Box>

            {/* Buscador (oculto en móviles) */}
            {!isMobile && (
              <TextField
                variant="outlined"
                placeholder="Buscar cursos..."
                size="small"
                sx={{
                  mx: 2,
                  width: '40%',
                  borderRadius: '30px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '30px',
                    backgroundColor: '#f5f5f5',
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#777' }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}

            {/* Botones de Iniciar sesión y Registrar */}
            <Box>
              <Button
                variant="outlined"
                onClick={handleLoginClick}
                sx={{
                  mx: 1,
                  borderRadius: '30px',
                  textTransform: 'none',
                  fontWeight: '500',
                  padding: isMobile ? '6px 12px' : '8px 20px',
                  borderColor: '#007BFF',
                  color: '#007BFF',
                  '&:hover': {
                    backgroundColor: '#007BFF',
                    color: 'white',
                    borderColor: '#007BFF',
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
                  borderRadius: '30px',
                  textTransform: 'none',
                  fontWeight: '500',
                  padding: isMobile ? '6px 12px' : '8px 20px',
                  backgroundColor: '#007BFF',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#0056b3',
                    boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
                  },
                }}
              >
                Registrar
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Carrusel */}
        <Carousel
          sx={{ marginBottom: '32px' }}
          animation="fade"
          navButtonsAlwaysVisible={!isMobile} // Oculta botones en móviles
          fullHeightHover
        >
          {carouselItems.map((item) => (
            <Box
              key={item.id}
              sx={{
                position: 'relative',
                height: isMobile ? '400px' : '700px', // Ajusta la altura en móviles
                backgroundImage: `url(${item.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  padding: '20px',
                  borderRadius: '12px',
                }}
              >
                <Typography variant={isMobile ? 'h4' : 'h3'} component="h2" sx={{ fontWeight: '600' }}>
                  {item.title}
                </Typography>
                <Typography variant={isMobile ? 'body1' : 'h6'} sx={{ marginTop: '10px' }}>
                  {item.description}
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    marginTop: '20px',
                    backgroundColor: '#007BFF',
                    '&:hover': {
                      backgroundColor: '#0056b3',
                    },
                  }}
                >
                  {item.buttonText}
                </Button>
              </Box>
            </Box>
          ))}
        </Carousel>

        {/* Contenido principal */}
        <Container sx={{ py: 8 }} maxWidth="lg">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '3rem',
            }}
          >
            <Typography variant="h3" component="h1" sx={{ fontWeight: '600', color: '#333' }}>
              Available Courses
            </Typography>
            {!isMobile && (
              <Button
                variant="outlined"
                sx={{
                  borderRadius: '30px',
                  textTransform: 'none',
                  fontWeight: '500',
                  padding: '8px 20px',
                  borderColor: '#007BFF',
                  color: '#007BFF',
                  '&:hover': {
                    backgroundColor: '#007BFF',
                    color: 'white',
                    borderColor: '#007BFF',
                  },
                }}
              >
                Ver más
              </Button>
            )}
          </div>
          <Grid container spacing={4}>
            {coursesData.map((course) => (
              <Grid item key={course.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '12px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={course.imageUrl}
                    alt={course.title}
                    sx={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}
                  />
                  <CardContent sx={{ flexGrow: 1, padding: '2rem' }}>
                    <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: '600', color: '#333' }}>
                      {course.title}
                    </Typography>
                    <Typography sx={{ color: '#555', fontSize: '1rem', lineHeight: '1.5', mb: 2 }}>
                      {course.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      Instructor: {course.instructor}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        mt: 2,
                        backgroundColor: '#007BFF',
                        '&:hover': {
                          backgroundColor: '#0056b3',
                        },
                      }}
                    >
                      Ver detalles
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            backgroundColor: '#f5f5f5',
            padding: '20px',
            marginTop: '40px',
            textAlign: 'center',
            borderTop: '1px solid #e0e0e0',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} SCDL. Todos los derechos reservados.
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default HomePage;