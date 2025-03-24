import { Typography, Box } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthorizationProvider";

const TeacherDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h3" gutterBottom>
        ¡Bienvenido!
      </Typography>
      <Typography variant="h4" color="primary" gutterBottom>
        {user?.username}
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
        Panel del Profesor
      </Typography>
    </Box>
  );
};

export default TeacherDashboard;
