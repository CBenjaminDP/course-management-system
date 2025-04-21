import React from "react";
import { Container } from "@mui/material";
import CrudUnits from "../../../../../components/Admin/UnitsCrud/CrudUnits";
import DashboardLayout from "../../../../../layouts/DashboardLayout";

const CourseUnitsManagement = () => {
  return (
    <DashboardLayout>
      <Container maxWidth="lg">
        <CrudUnits />
      </Container>
    </DashboardLayout>
  );
};

export default CourseUnitsManagement;
