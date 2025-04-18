import React from 'react';
import { Container } from '@mui/material';
import CrudUnits from '../../../../../components/Admin/UnitsCrud/CrudUnits';
import DashboardLayout from '../../../../../layouts/DashboardLayout';
import { useParams } from 'react-router-dom';

const CourseUnitsManagement = () => {
  const { courseId } = useParams();
  
  return (
    <DashboardLayout>
      <Container maxWidth="lg">
        <CrudUnits />
      </Container>
    </DashboardLayout>
  );
};

export default CourseUnitsManagement;