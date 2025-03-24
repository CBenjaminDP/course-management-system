import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ModalCreateTeacher from "./ModalCreateTeacher";

const CrudTeachers = () => {
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      department: "Computer Science",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      department: "Mathematics",
    },
  ]);

  const [openModal, setOpenModal] = useState(false);

  const handleCreateTeacher = (newTeacher) => {
    setTeachers((prev) => [...prev, { ...newTeacher, id: prev.length + 1 }]);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Button
        variant="contained"
        onClick={() => setOpenModal(true)}
        sx={{
          mb: 3,
          bgcolor: "#1a1a1a",
          "&:hover": {
            bgcolor: "#333",
          },
        }}
      >
        Add New Teacher
      </Button>

      <ModalCreateTeacher
        open={openModal}
        handleClose={() => setOpenModal(false)}
        handleCreate={handleCreateTeacher}
      />

      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>Department</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow 
                key={teacher.id}
                sx={{ 
                  '&:hover': { 
                    bgcolor: 'rgba(0, 0, 0, 0.02)'
                  }
                }}
              >
                <TableCell>{teacher.name}</TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>{teacher.department}</TableCell>
                <TableCell>
                  <IconButton size="small" sx={{ color: '#1a1a1a' }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" sx={{ color: '#1a1a1a' }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CrudTeachers;
