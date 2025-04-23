"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAlert } from "@/context/AlertContext";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Stack,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Importación dinámica para framer-motion
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

// Paleta de colores basada en el logo (igual que en los otros componentes)
const theme = {
  primary: "#FFD700", // Amarillo/dorado del logo
  secondary: "#4A4A4A", // Gris oscuro para contraste
  accent: "#F5F5F5", // Gris claro para fondos
  text: "#333333", // Casi negro para texto
  white: "#FFFFFF", // Blanco puro
  hover: "#E6C200", // Amarillo más oscuro para hover
};

// Componentes estilizados
const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    transition: "all 0.3s",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.primary,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.primary,
      borderWidth: "1px",
    },
  },
  "& .MuiFormLabel-root.Mui-focused": {
    color: theme.secondary,
  },
  "& .MuiFormHelperText-root": {
    marginLeft: "0px",
  },
}));

const StyledButton = styled(Button)(() => ({
  borderRadius: "8px",
  padding: "10px 0",
  textTransform: "none",
  fontWeight: "600",
  backgroundColor: theme.primary,
  color: theme.text,
  boxShadow: "none",
  transition: "all 0.3s",
  "&:hover": {
    backgroundColor: theme.hover,
    boxShadow: `0 4px 12px rgba(255, 215, 0, 0.3)`,
  },
}));

const StyledFormLabel = styled(FormLabel)(() => ({
  color: theme.secondary,
  fontWeight: "500",
  marginBottom: "4px",
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(4),
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
  border: "1px solid #eee",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)",
    transform: "translateY(-5px)",
  },
}));

const ResetContainer = styled(Box)(() => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem",
  background: "linear-gradient(to bottom right, #fff, #f8f9fa)",
}));

const ResetPassword = ({ token }) => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showAlert } = useAlert();

  const validatePassword = (pass) => {
    const errors = {};
    if (pass.length < 8) {
      errors.password = "La contraseña debe tener al menos 8 caracteres";
    }
    if (!/\d/.test(pass)) {
      errors.password = "La contraseña debe contener al menos un número";
    }
    if (!/[A-Z]/.test(pass)) {
      errors.password = "La contraseña debe contener al menos una mayúscula";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validar contraseña
    const validationErrors = validatePassword(password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    // Verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setErrors({ confirm: "Las contraseñas no coinciden" });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/usuarios/reset-password/",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ token, password }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        showAlert({
          message: data.message || "Contraseña restablecida correctamente",
          severity: "success",
        });
        setTimeout(() => router.push("/login"), 2000);
      } else {
        showAlert({
          message: data.error || "Hubo un error al restablecer la contraseña",
          severity: "error",
        });
      }
    } catch (error) {
      showAlert({
        message: "Error de conexión al servidor",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push("/login");
  };

  if (loading) {
    return (
      <ResetContainer>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          gap={3}
        >
          <CircularProgress size={60} sx={{ color: theme.primary }} />
          <Typography variant="h6" color={theme.secondary}>
            Restableciendo contraseña...
          </Typography>
        </Box>
      </ResetContainer>
    );
  }

  return (
    <ResetContainer>
      <MotionDiv
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
        exit={{ opacity: 0, y: -50, transition: { duration: 0.5 } }}
        style={{ width: "100%", maxWidth: "450px" }}
      >
        <Stack direction="column" spacing={2} width="100%">
          {/* Botón de regresar */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            sx={{
              alignSelf: "flex-start",
              mb: 2,
              color: theme.secondary,
              "&:hover": {
                color: theme.primary,
                backgroundColor: "transparent",
              },
            }}
          >
            Regresar a inicio de sesión
          </Button>

          <StyledPaper>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              align="center"
              sx={{
                fontWeight: "600",
                color: theme.text,
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: "-10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "60px",
                  height: "3px",
                  backgroundColor: theme.primary,
                },
              }}
            >
              Restablecer Contraseña
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 4,
                mt: 3,
                textAlign: "center",
                color: theme.secondary,
              }}
            >
              Ingresa tu nueva contraseña
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%" }}
            >
              <FormControl sx={{ width: "100%", mb: 3 }}>
                <StyledFormLabel htmlFor="password">
                  Nueva contraseña
                </StyledFormLabel>
                <StyledTextField
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu nueva contraseña"
                  fullWidth
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: theme.secondary }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>

              <FormControl sx={{ width: "100%", mb: 3 }}>
                <StyledFormLabel htmlFor="confirmPassword">
                  Confirma tu contraseña
                </StyledFormLabel>
                <StyledTextField
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirma tu nueva contraseña"
                  fullWidth
                  variant="outlined"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!!errors.confirm}
                  helperText={errors.confirm}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                          sx={{ color: theme.secondary }}
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>

              <StyledButton
                type="submit"
                fullWidth
                variant="contained"
                size="large"
              >
                Restablecer Contraseña
              </StyledButton>
            </Box>
          </StyledPaper>
        </Stack>
      </MotionDiv>
    </ResetContainer>
  );
};

export default ResetPassword;
