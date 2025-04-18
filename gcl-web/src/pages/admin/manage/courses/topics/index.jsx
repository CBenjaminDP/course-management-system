import React from 'react';
import { Container } from '@mui/material';
import CrudTopics from '../../../../../components/Admin/TopicsCrud/CrudTopics';
import DashboardLayout from '../../../../../layouts/DashboardLayout';
import { useParams } from 'react-router-dom';

const CourseTopicsManagement = () => {
  const { unitId } = useParams();
  
  return (
    <DashboardLayout>
      <Container maxWidth="lg">
        <CrudTopics unitId={unitId} />
      </Container>
    </DashboardLayout>
  );
};

export default CourseTopicsManagement;