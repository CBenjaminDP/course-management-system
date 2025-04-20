import React from 'react';
import { Container } from '@mui/material';
import CrudCourses from '../../../../components/Admin/CoursesCrud/CrudCourses';
import DashboardLayout from '../../../../layouts/DashboardLayout';

const CoursesManagement = () => {
  return (
    <DashboardLayout>
      <Container maxWidth="lg">
        <CrudCourses />
      </Container>
    </DashboardLayout>
  );
};

export default CoursesManagement;
