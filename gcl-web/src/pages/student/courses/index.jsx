import { Box } from "@mui/material";
import DashboardLayout from "../../../layouts/DashboardLayout";
import ComponentePadreCourse from "@/components/Student/ComponentePadreCourses";

function PageCourses() {
  return (
    <DashboardLayout>
      <Box sx={{ minHeight: "100vh" }}>
        <ComponentePadreCourse />
      </Box>
    </DashboardLayout>
  );
}

export default PageCourses;
