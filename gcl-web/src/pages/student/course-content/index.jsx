import { Box } from "@mui/material";
import DashboardLayout from "../../../layouts/DashboardLayout";
import CourseContent from "@/components/Student/CourseContent";

function PageMoreCourses() {
  return (
    <DashboardLayout>
      <Box sx={{ minHeight: "100vh" }}>
        <CourseContent />
      </Box>
    </DashboardLayout>
  );
}

export default PageMoreCourses;
