import React from 'react';
import { Container } from '@mui/material';
import CrudTasks from '../../../../../components/Admin/TasksCrud/CrudTasks';
import DashboardLayout from '../../../../../layouts/DashboardLayout';
import { useParams } from 'react-router-dom';

const CourseTasksManagement = () => {
  const { topicId } = useParams();
  
  return (
    <DashboardLayout>
      <Container maxWidth="lg">
        <CrudTasks topicId={topicId} />
      </Container>
    </DashboardLayout>
  );
};

export default CourseTasksManagement;