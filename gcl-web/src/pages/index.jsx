import React from 'react';
import { 
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button
} from '@mui/material';
import { useRouter } from 'next/navigation';

// Sample course data
const coursesData = [
  {
    id: 1,
    title: "Introduction to React",
    description: "Learn the fundamentals of React including components, props, and state management",
    instructor: "John Doe",
    imageUrl: "https://blog.wildix.com/wp-content/uploads/2020/06/react-logo.jpg"
  },
  {
    id: 2,
    title: "Advanced JavaScript",
    description: "Deep dive into JavaScript concepts including closures, promises, and async/await",
    instructor: "Jane Smith",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTvTsaCQ0AVQCJQ_rq-jkfT40f03me0dOq9g&s"
  },
  {
    id: 3,
    title: "Python for Beginners",
    description: "Start your programming journey with Python fundamentals",
    instructor: "Mike Johnson",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYZqZkpMyiN2uSuT7GAf6JSkJ44YsZqoQHdw&s"
  }
];

const HomePage = () => {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login');
  };

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: '600' }}>
          Available Courses
        </Typography>
        <Button
          variant="contained"
          onClick={handleLoginClick}
          sx={{
            backgroundColor: '#007BFF',
            color: 'white',
            '&:hover': { backgroundColor: '#0056b3' },
            padding: '10px 20px',
            borderRadius: '30px',
            fontWeight: '500',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:active': {
              transform: 'scale(0.98)',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)'
            }
          }}
        >
          Iniciar sesión
        </Button>
      </div>
      <Grid container spacing={4}>
        {coursesData.map((course) => (
          <Grid item key={course.id} xs={12} sm={6} md={4}>
            <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '12px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)'
              }
            }}>
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
                <Typography sx={{ color: '#555', fontSize: '1rem', lineHeight: '1.5' }}>
                  {course.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                  Instructor: {course.instructor}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;
