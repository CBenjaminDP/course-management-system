import { Box } from '@mui/material';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Assignments from '@/components/Student/Assignments';

function PageAssignments() {
  return (
    <DashboardLayout>
      <Box sx={{ minHeight: '100vh' }}>
        <Assignments />
      </Box>
    </DashboardLayout>
  );
}

export default PageAssignments;