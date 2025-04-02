import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthorizationProvider";
import DashboardLayout from "../../layouts/DashboardLayout";
import AdminDashboard from "../../components/Dashboard/AdminDashboard";
import TeacherDashboard from "../../components/Dashboard/TeacherDashboard";
import StudentDashboard from "../../components/Dashboard/StudentDashboard";
import { Box } from "@mui/material";
import Cookies from "js-cookie";

const Dashboard = () => {
  const { user, validateToken } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      if (!user) {
        await validateToken();
      }
    };

    checkAuth();
  }, [user, router, validateToken]);

  const renderDashboard = () => {
    switch (user?.rol) {
      case "admin":
        return <AdminDashboard />;
      case "teacher":
        return <TeacherDashboard />;
      case "student":
        return <StudentDashboard />;
      default:
        return null;
    }
  };

  // Show loading or null while checking authentication
  if (!user) return null;

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <DashboardLayout>{renderDashboard()}</DashboardLayout>
    </Box>
  );
};

export default Dashboard;
