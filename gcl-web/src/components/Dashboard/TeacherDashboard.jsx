import {
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthorizationProvider";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Cookies from "js-cookie";
import { useTheme } from "@mui/material/styles";
import { useAlert } from "../../context/AlertContext";

// Colores personalizados
const themeColors = {
  primary: "#FFD700",
  secondary: "#4A4A4A",
  text: "#333333",
  hover: "#E6C200",
};

const TeacherDashboard = () => {
  const theme = useTheme();
  const { user } = useContext(AuthContext);
  const { showAlert } = useAlert();
  const [userDetails, setUserDetails] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(passwordForm.newPassword)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula, un número y un carácter especial"
      );
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Las contraseñas nuevas no coinciden");
      return;
    }

    try {
      const token = Cookies.get("accessToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/usuarios/cambiar-password/${user.user_id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            current_password: passwordForm.currentPassword,
            new_password: passwordForm.newPassword,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        showAlert({
          message: "Contraseña actualizada exitosamente",
          severity: "success",
        });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        showAlert({
          message: data.error || "Error al cambiar la contraseña",
          severity: "error",
        });
      }
    } catch (error) {
      showAlert({
        message: "Error al procesar la solicitud",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = Cookies.get("accessToken");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/usuarios/uuid/${user.user_id}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.ok) {
          const data = await response.json();
          setUserDetails(data);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (user?.user_id) {
      fetchUserDetails();
    }
  }, [user]);

  const InfoItem = ({ icon, label, value }) => (
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      {icon}
      <Box sx={{ ml: 2 }}>
        <Typography color={themeColors.secondary} variant="body2">
          {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        p: { xs: 2, md: 0 },
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 10,
          backgroundColor: "#fff",
          width: "100%",
          maxWidth: 1200,
          mx: "auto",
          my: "auto",
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: themeColors.text,
          }}
        >
          ¡Bienvenido!
        </Typography>

        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 500,
            textAlign: "center",
            mb: 4,
            color: themeColors.primary,
          }}
        >
          {user?.username}
        </Typography>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <InfoItem
              icon={<PersonIcon sx={{ color: themeColors.primary }} />}
              label="Nombre Completo"
              value={userDetails?.nombre_completo || user?.username}
            />
            <InfoItem
              icon={<EmailIcon sx={{ color: themeColors.primary }} />}
              label="Correo Electrónico"
              value={userDetails?.email || user?.email}
            />
            <InfoItem
              icon={
                <AdminPanelSettingsIcon sx={{ color: themeColors.primary }} />
              }
              label="Rol"
              value={
                userDetails?.rol?.toUpperCase() || user?.rol?.toUpperCase()
              }
            />
          </Grid>
        </Grid>

        <Box
          sx={{
            width: "100%",
            maxWidth: 800,
            mt: 4,
            pt: 4,
            borderTop: "1px solid rgba(0, 0, 0, 0.12)",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 3,
              color: themeColors.text,
              fontWeight: 500,
              justifyContent: "center",
            }}
          >
            <LockIcon sx={{ color: themeColors.primary }} />
            Cambiar Contraseña
          </Typography>

          <Box
            component="form"
            onSubmit={handlePasswordChange}
            sx={{
              width: "100%",
              maxWidth: 400,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mx: "auto",
            }}
          >
            <TextField
              fullWidth
              type={showCurrentPassword ? "text" : "password"}
              label="Contraseña Actual"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  currentPassword: e.target.value,
                })
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      edge="end"
                    >
                      {showCurrentPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              required
            />
            <TextField
              fullWidth
              type={showNewPassword ? "text" : "password"}
              label="Nueva Contraseña"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value,
                })
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              required
              helperText="Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial"
            />
            <TextField
              fullWidth
              type={showConfirmPassword ? "text" : "password"}
              label="Confirmar Nueva Contraseña"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              required
            />

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            {success && (
              <Typography sx={{ color: "green" }} variant="body2">
                {success}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: themeColors.primary,
                color: themeColors.text,
                borderRadius: 2,
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: themeColors.hover,
                },
              }}
            >
              Cambiar Contraseña
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default TeacherDashboard;
