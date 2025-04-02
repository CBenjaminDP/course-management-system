import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper
} from '@mui/material';
import { Add, Refresh } from '@mui/icons-material';
import ModalCreateCourse from './ModalCreateCourse';
import ModalUpdateCourse from './ModalUpdateCourse';

const CrudCourses = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // You'll implement these functions later
  const handleCreateCourse = (newCourse) => {
    console.log('Creating course:', newCourse);
  };

  const handleUpdateCourse = (id, updatedData) => {
    console.log('Updating course:', id, updatedData);
  };

  const handleDeleteCourse = (id) => {
    console.log('Deleting course:', id);
  };

  return (
    <Card>
      <CardHeader
        title="Courses Management"
        action={
          <Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenCreateModal(true)}
            >
              Add Course
            </Button>
            <IconButton onClick={() => console.log('Refresh')}>
              <Refresh />
            </IconButton>
          </Box>
        }
      />
      <CardContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Courses data will go here */}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      <ModalCreateCourse
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onCreate={handleCreateCourse}
      />

      <ModalUpdateCourse
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        onUpdate={handleUpdateCourse}
        course={selectedCourse}
      />
    </Card>
  );
};

export default CrudCourses;