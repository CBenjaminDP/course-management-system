import React from 'react';
import { 
  Box,
  Container,
  Typography,
  Paper,
  Grid
} from '@mui/material';

const CoursesManagement = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Course Management
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6">
                Welcome to Course Management System
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default CoursesManagement;
