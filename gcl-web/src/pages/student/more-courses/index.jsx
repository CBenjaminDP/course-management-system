import { Box } from '@mui/material';
import DashboardLayout from '../../../layouts/DashboardLayout';
import MoreCourses from '@/components/Student/More-Courses';

function PageMoreCourses() {
  return (
    <DashboardLayout>
      <Box sx={{ minHeight: '100vh' }}>
        <MoreCourses />
      </Box>
    </DashboardLayout>
  );
}

export default PageMoreCourses;