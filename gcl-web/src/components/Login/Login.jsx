"use client";

import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthorizationProvider";
import {
  TextField,
  Button,
  Box,
  Typography,
  Link,
  IconButton,
  InputAdornment,
  Divider,
  Stack,
  FormControl,
  FormLabel,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { styled } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { useAlert } from "@/context/AlertContext";

// Paleta de colores basada en el logo
const theme = {
  primary: "#FFD700", // Amarillo/dorado del logo
  secondary: "#4A4A4A", // Gris oscuro para contraste
  accent: "#F5F5F5", // Gris claro para fondos
  text: "#333333", // Casi negro para texto
  white: "#FFFFFF", // Blanco puro
  hover: "#E6C200", // Amarillo más oscuro para hover
};

// Esquema de validación con Yup
const validationSchema = Yup.object({
  username: Yup.string().required("El nombre de usuario es obligatorio"),
  password: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(/[a-zA-Z]/, "Debe contener al menos una letra")
    .matches(/[0-9]/, "Debe contener al menos un número")
    .required("La contraseña es obligatoria"),
});

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
  borderRadius: "12px",
  border: "1px solid #eee",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)",
    transform: "translateY(-5px)",
  },
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage: "linear-gradient(to bottom right, #fff, #f8f9fa)",
    backgroundRepeat: "no-repeat",
  },
}));

// Styled components for form elements
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

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { showAlert } = useAlert();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await login(values.username, values.password);
        showAlert({
          message: "Inicio de sesión exitoso",
          severity: "success",
        });
      } catch (error) {
        showAlert({
          message: `Inicio de session fallido: ${error.message}`,
          severity: "error",
        });
      }
      setSubmitting(false);
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <SignInContainer direction="column" justifyContent="space-between">
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
        Regresar al inicio
      </Button>

      <Card variant="outlined">
        {/* Logo */}
        <Box sx={{ mb: 0, textAlign: "center" }}>
          <Image
            src="/logo.png"
            alt="Logo"
            width={150}
            height={150}
            style={{ objectFit: "contain" }}
          />
        </Box>

        {/* Título */}
        <Typography
          component="h1"
          variant="h4"
          sx={{
            width: "100%",
            fontSize: "clamp(1.8rem, 8vw, 2rem)",
            textAlign: "center",
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
          Iniciar sesión
        </Typography>

        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
            mt: 3,
          }}
        >
          {/* Campo de Usuario */}
          <FormControl>
            <StyledFormLabel htmlFor="username">
              Nombre de usuario
            </StyledFormLabel>
            <StyledTextField
              id="username"
              name="username"
              placeholder="Ingresa tu nombre de usuario"
              autoComplete="username"
              fullWidth
              variant="outlined"
              {...formik.getFieldProps("username")}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
          </FormControl>

          {/* Campo de Contraseña */}
          <FormControl>
            <StyledFormLabel htmlFor="password">Contraseña</StyledFormLabel>
            <StyledTextField
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
              fullWidth
              variant="outlined"
              {...formik.getFieldProps("password")}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
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

          {/* Botón de inicio de sesión */}
          <StyledButton
            type="submit"
            fullWidth
            variant="contained"
            disabled={formik.isSubmitting}
          >
            Iniciar sesión
          </StyledButton>

          {/* Olvidé mi contraseña */}
          <Link
            component="button"
            type="button"
            variant="body2"
            sx={{
              alignSelf: "center",
              color: theme.secondary,
              textDecoration: "none",
              "&:hover": {
                color: theme.primary,
              },
            }}
          >
            Olvidé mi contraseña
          </Link>
        </Box>

        {/* Divider */}
        <Divider
          sx={{
            my: 2,
            "&::before, &::after": {
              borderColor: "rgba(0, 0, 0, 0.08)",
            },
            "& .MuiDivider-wrapper": {
              color: theme.secondary,
            },
          }}
        >
          o
        </Divider>

        {/* Enlace para registrarse */}
        <Typography sx={{ textAlign: "center", mt: 1, color: theme.secondary }}>
          ¿No tienes una cuenta?{" "}
          <Link
            href="/register"
            variant="body2"
            sx={{
              color: theme.primary,
              textDecoration: "none",
              fontWeight: "600",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Regístrate
          </Link>
        </Typography>
      </Card>
    </SignInContainer>
  );
};

export default LoginForm;
