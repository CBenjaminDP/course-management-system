import { Box } from '@mui/material';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Courses from '@/components/Student/Courses';

function PageCourses() {
  return (
    <DashboardLayout>
      <Box sx={{ minHeight: '100vh' }}>
        <Courses />
      </Box>
    </DashboardLayout>
  );
}

export default PageCourses;