import { Typography, Box } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthorizationProvider";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        ¡Bienvenido!
      </Typography>
      <Typography variant="h4" color="primary" gutterBottom>
        {user?.username}
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
        Panel de Administración
      </Typography>
    </Box>
  );
};

export default AdminDashboard;
