import React, { useState } from "react";
import { Box, Container, Typography, Tabs, Tab } from "@mui/material";
import DashboardLayout from "../../../../../layouts/DashboardLayout";
import CrudAdmins from "../../../../../components/Admin/AdminsCrud/CrudAdmins";

const AdminsManagement = () => {
  const [selectedTab, setSelectedTab] = useState("admins");

  const handleTabChange = (_, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <DashboardLayout>
      <Container maxWidth="lg">
        <Box sx={{ py: 0 }}>
          <Typography variant="h4" gutterBottom>
            Gestión de Administradores
          </Typography>
          <Box sx={{ mt: 0 }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <Tab label="Listado de Administradores" value="admins" />
            </Tabs>
            <Box sx={{ pt: 0 }}>
              {selectedTab === "admins" && <CrudAdmins />}
            </Box>
          </Box>
        </Box>
      </Container>
    </DashboardLayout>
  );
};

export default AdminsManagement;