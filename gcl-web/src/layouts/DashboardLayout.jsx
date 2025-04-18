import { Box, AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../context/AuthorizationProvider";
import LogoutIcon from "@mui/icons-material/Logout";
import Sidebar from "../components/Sidebar/Sidebar";

const DashboardLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);

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
          display: "flex",
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
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: "240px" },
          bgcolor: "white",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
        }}
      >
        <Toolbar>
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
            onClick={logout}
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
          pl: { sm: "240px" },
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
