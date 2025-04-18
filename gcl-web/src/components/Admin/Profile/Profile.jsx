import { Typography, Box, Paper, Grid } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthorizationProvider";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import { useTheme } from '@mui/material/styles';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LockIcon from '@mui/icons-material/Lock';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BadgeIcon from '@mui/icons-material/Badge';
import Cookies from "js-cookie";

const Profile = () => {
    const { user: contextUser } = useContext(AuthContext);
    const theme = useTheme();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = Cookies.get("accessToken");
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                
                const response = await fetch(
                    `${baseUrl}/usuarios/uuid/${contextUser.user_id}/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched user data:', data);
                    setUser(data);
                } else {
                    console.error('Failed to fetch user data, using context data');
                    setUser(contextUser); // Fallback to context data
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setUser(contextUser); // Fallback to context data
            } finally {
                setLoading(false);
            }
        };

        if (contextUser?.user_id) {
            fetchUserData();
        }
    }, [contextUser]);

    if (loading) {
        return <Typography>Cargando perfil...</Typography>;
    }
    return (
        <Box sx={{
            p: { xs: 2, md: 0 },
            backgroundColor: theme.palette.background.default,
            minHeight: '100vh'
        }}>
            <Paper
                elevation={4}
                sx={{
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderRadius: 10,
                    background: "linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)",
                    width: "100%",
                    maxWidth: 1200,
                    mx: 'auto',
                    my: 'auto'
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
                    ¡Tu Perfil!
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <PersonIcon color="primary" sx={{ mr: 2 }} />
                            <Typography>
                                <strong>Usuario:</strong> {user?.username || 'N/A'}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <BadgeIcon color="primary" sx={{ mr: 2 }} />
                            <Typography>
                                <strong>ID:</strong> {user?.id || 'N/A'}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <LockIcon color="primary" sx={{ mr: 2 }} />
                            <Typography>
                                <strong>Contraseña:</strong> ••••••••
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <PersonIcon color="primary" sx={{ mr: 2 }} />
                            <Typography>
                                <strong>Nombre Completo:</strong> {user?.nombre_completo || 'N/A'}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <EmailIcon color="primary" sx={{ mr: 2 }} />
                            <Typography>
                                <strong>Email:</strong> {user?.email || 'N/A'}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <AdminPanelSettingsIcon color="primary" sx={{ mr: 2 }} />
                            <Typography>
                                <strong>Rol:</strong> {user?.rol ? user.rol.toUpperCase() : 'N/A'}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <CalendarTodayIcon color="primary" sx={{ mr: 2 }} />
                            <Typography>
                                <strong>Fecha de Registro:</strong> {user?.fecha_creacion ? 
                                    new Date(user.fecha_creacion).toLocaleDateString('es-ES') : 'N/A'}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default Profile;