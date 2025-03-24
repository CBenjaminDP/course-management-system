import { Box, AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../context/AuthorizationProvider";
import LogoutIcon from "@mui/icons-material/Logout";
import Sidebar from "../components/Sidebar/Sidebar";

const DashboardLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <Box sx={{ bgcolor: "#f5f5f7" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.8)",
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
          mt: "64px",
          ml: "240px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          p: 4,
          width: `calc(100% - 240px)`,
          maxWidth: "1600px",
          margin: "64px auto 0 240px",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
