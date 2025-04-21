import { Box, AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthorizationProvider";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../components/Sidebar/Sidebar";
import { useAlert } from "../context/AlertContext";
import { useRouter } from "next/navigation";

const DashboardLayout = ({ children }) => {
  const { user, logout, isLoggingOut } = useContext(AuthContext);
  const { showAlert } = useAlert();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      // The logout function now handles everything including the redirect
      await logout();

      // Show success message
      showAlert({
        message: "Has cerrado sesión correctamente",
        severity: "success",
      });

      // No need to navigate here as it's handled in the logout function
    } catch (error) {
      console.error("Error during logout:", error);
      showAlert({
        message: "Error al cerrar sesión",
        severity: "error",
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "rgba(255, 255, 255, 0)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "240px",
          height: "64px",
          bgcolor: "white",
          zIndex: 1300,
          display: { xs: "none", sm: "flex" },
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
        }}
      >
        <img
          src="/logo.png" // Asegúrate de poner tu imagen en la carpeta public
          alt="Logo"
          style={{
            maxWidth: "180px",
            maxHeight: "40px",
            objectFit: "contain",
          }}
        />
      </Box>

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { xs: "100%", sm: `calc(100% - 240px)` },
          ml: { xs: 0, sm: "240px" },
          bgcolor: "white",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }, color: "#1a1a1a" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              color: "#1a1a1a",
              fontWeight: 500,
            }}
          >
            {user?.username?.toUpperCase()}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#666",
              mr: 2,
              fontWeight: 500,
            }}
          >
            {user?.rol?.toUpperCase()}
          </Typography>
          <IconButton
            onClick={handleLogout}
            sx={{
              color: "#1a1a1a",
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Sidebar 
        rol={user?.rol} 
        isMobile={true}
        mobileOpen={mobileOpen}
        onClose={handleDrawerToggle}
      />
      
      <Sidebar rol={user?.rol} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: "100%",
          minHeight: "100vh",
          overflow: "auto",
          pt: { xs: 8, sm: 9 },
          pl: { xs: 0, sm: "240px" },
          "& > *": {
            maxWidth: "100%",
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
