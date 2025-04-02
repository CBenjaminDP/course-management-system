import { Typography, Box, Paper, Container, Grid, TextField, Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthorizationProvider";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LockIcon from '@mui/icons-material/Lock';
import Cookies from "js-cookie"; // Add this import

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    try {
      const token = Cookies.get("accessToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/usuarios/cambiar-password/${user.user_id}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            current_password: passwordForm.currentPassword,
            new_password: passwordForm.newPassword,
          }),
        }
      );

      if (response.ok) {
        setSuccess('Contraseña actualizada exitosamente');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        const data = await response.json();
        setError(data.error || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      setError('Error al procesar la solicitud');
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = Cookies.get("accessToken"); // Get token from cookies
        console.log(token);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/usuarios/uuid/${user.user_id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);

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
        <Typography color="text.secondary" variant="body2">
          {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 2,
            background: "linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)",
            width: "100%",
            maxWidth: 800,
          }}
        >
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 600,
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ¡Bienvenido!
          </Typography>

          <Typography
            variant="h4"
            color="primary"
            gutterBottom
            sx={{
              fontWeight: 500,
              textAlign: "center",
              mb: 4,
            }}
          >
            {user?.username}
          </Typography>

          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <InfoItem
                icon={<PersonIcon color="primary" />}
                label="Nombre Completo"
                value={userDetails?.nombre_completo || user?.username}
              />
              <InfoItem
                icon={<EmailIcon color="primary" />}
                label="Correo Electrónico"
                value={userDetails?.email || user?.email}
              />
              <InfoItem
                icon={<AdminPanelSettingsIcon color="primary" />}
                label="Rol"
                value={userDetails?.rol?.toUpperCase() || user?.rol?.toUpperCase()}
              />
              <InfoItem
                icon={<CalendarTodayIcon color="primary" />}
                label="Fecha de Registro"
                value={
                  userDetails?.fecha_creacion
                    ? new Date(userDetails.fecha_creacion).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })
                    : "No disponible"
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
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 3,
                color: '#1a1a1a',
                fontWeight: 500,
                justifyContent: 'center',
              }}
            >
              <LockIcon color="primary" />
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
                type="password"
                label="Contraseña Actual"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
                required
              />
              <TextField
                fullWidth
                type="password"
                label="Nueva Contraseña"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                required
              />
              <TextField
                fullWidth
                type="password"
                label="Confirmar Nueva Contraseña"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                required
              />
              
              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}
              {success && (
                <Typography color="success.main" variant="body2">
                  {success}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Cambiar Contraseña
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
