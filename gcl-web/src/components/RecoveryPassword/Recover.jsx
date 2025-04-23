"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAlert } from "@/context/AlertContext";
import { Visibility, VisibilityOff } from "@mui/icons-material";
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Paleta de colores basada en el logo (igual que en el LoginForm)
const theme = {
  primary: "#FFD700", // Amarillo/dorado del logo
  secondary: "#4A4A4A", // Gris oscuro para contraste
  accent: "#F5F5F5", // Gris claro para fondos
  text: "#333333", // Casi negro para texto
  white: "#FFFFFF", // Blanco puro
  hover: "#E6C200", // Amarillo más oscuro para hover
};

// Componentes estilizados (similar al LoginForm)
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

const RecoverContainer = styled(Box)(() => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem",
  background: "linear-gradient(to bottom right, #fff, #f8f9fa)",
}));

const Recover = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/usuarios/send-reset-email/",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        showAlert({
          message:
            data.message ||
            "Se ha enviado un correo con instrucciones para recuperar tu contraseña",
          severity: "success",
        });
        setTimeout(() => router.push("/login"), 3000);
      } else {
        showAlert({
          message: data.error || "Error al enviar el correo de recuperación",
          severity: "error",
        });
      }
    } catch (error) {
      showAlert({
        message: "Error al conectar con el servidor",
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
      <RecoverContainer>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          gap={3}
        >
          <CircularProgress size={60} sx={{ color: theme.primary }} />
          <Typography variant="h6" color={theme.secondary}>
            Enviando instrucciones...
          </Typography>
        </Box>
      </RecoverContainer>
    );
  }

  return (
    <RecoverContainer>
      <motion.div
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
              Recuperar Contraseña
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
              Ingresa el correo electrónico asociado a tu cuenta y te enviaremos
              instrucciones para restablecer tu contraseña
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%" }}
            >
              <FormControl sx={{ width: "100%", mb: 3 }}>
                <StyledFormLabel htmlFor="email">
                  Correo electrónico
                </StyledFormLabel>
                <StyledTextField
                  id="email"
                  type="email"
                  placeholder="Ingresa tu correo electrónico"
                  fullWidth
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormControl>

              <StyledButton
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
              >
                Enviar instrucciones
              </StyledButton>
            </Box>
          </StyledPaper>
        </Stack>
      </motion.div>
    </RecoverContainer>
  );
};

export default Recover;
