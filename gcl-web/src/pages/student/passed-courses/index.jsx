import { Box } from "@mui/material";
import DashboardLayout from "../../../layouts/DashboardLayout";
import PassedCourses from "@/components/Student/PassedCourses";

function PagePassedCourses() {
  return (
    <DashboardLayout>
      <Box sx={{ minHeight: "100vh" }}>
        <PassedCourses />
      </Box>
    </DashboardLayout>
  );
}

export default PagePassedCourses;
