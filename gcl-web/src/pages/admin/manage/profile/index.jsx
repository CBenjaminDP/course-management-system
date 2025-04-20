import React from 'react';
import { Container } from '@mui/material';
import ProfileComponent from '../../../../components/Admin/Profile/Profile';
import DashboardLayout from '../../../../layouts/DashboardLayout';

const ProfileManagement = () => {
  return (
    <DashboardLayout>
        <ProfileComponent />
    </DashboardLayout>
  );
};

export default ProfileManagement;