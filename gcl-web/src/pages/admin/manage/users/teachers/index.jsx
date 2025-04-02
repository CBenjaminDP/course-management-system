import React, { useState } from "react";
import { Box, Typography, Container, Tab, Tabs } from "@mui/material";
import DashboardLayout from "../../../../../layouts/DashboardLayout";
import CrudTeachers from "../../../../../components/Admin/TeachersCrud/CrudTeachers";

const TeachersManagement = () => {
  const [selectedTab, setSelectedTab] = useState("teachers");

  const handleTabChange = (_, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <DashboardLayout>
      <Container maxWidth="lg">
        <Box sx={{ py: 0 }}>
          <Typography variant="h4" gutterBottom>
            Gestión de Profesores
          </Typography>
          <Box sx={{ mt: 0 }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <Tab label="Listado de Profesores" value="teachers" />
            </Tabs>
            <Box sx={{ pt: 0 }}>
              {selectedTab === "teachers" && <CrudTeachers />}
            </Box>
          </Box>
        </Box>
      </Container>
    </DashboardLayout>
  );
};

export default TeachersManagement;
