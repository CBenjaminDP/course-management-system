import React, { useState } from "react";
import { Box, Container, Typography, Tabs, Tab } from "@mui/material";
import DashboardLayout from "../../../../../layouts/DashboardLayout";
import CrudStudents from "../../../../../components/Admin/StudentsCrud/CrudStudents"; // Ensure this matches

const StudentsManagement = () => {
  const [selectedTab, setSelectedTab] = useState("students");

  const handleTabChange = (_, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <DashboardLayout>
      <Container maxWidth="lg">
        <Box sx={{ py: 0 }}>
          <Typography variant="h4" gutterBottom>
            Gestión de Estudiantes
          </Typography>
          <Box sx={{ mt: 0 }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <Tab label="Listado de Estudiantes" value="students" />
            </Tabs>
            <Box sx={{ pt: 0 }}>
              {selectedTab === "students" && <CrudStudents />}
            </Box>
          </Box>
        </Box>
      </Container>
    </DashboardLayout>
  );
};

export default StudentsManagement;