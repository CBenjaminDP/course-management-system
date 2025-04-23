"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Link,
  Divider,
  Stack,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAlert } from "../../context/AlertContext";

// Paleta de colores basada en el logo
const theme = {
  primary: "#FFD700", // Amarillo/dorado del logo
  secondary: "#4A4A4A", // Gris oscuro para contraste
  accent: "#F5F5F5", // Gris claro para fondos
  text: "#333333", // Casi negro para texto
  white: "#FFFFFF", // Blanco puro
  hover: "#E6C200", // Amarillo más oscuro para hover
};

// Esquema de validación con Yup - Simplificado para nombre y correo
const validationSchema = Yup.object({
  nombre_completo: Yup.string()
    .required("El nombre completo es obligatorio")
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  email: Yup.string()
    .email("Correo inválido")
    .required("El correo es obligatorio"),
  rol: Yup.string()
    .required("El rol es obligatorio")
    .oneOf(["student", "teacher"], "Rol inválido"),
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

const StyledRadio = styled(Radio)(() => ({
  color: theme.secondary,
  "&.Mui-checked": {
    color: theme.primary,
  },
}));

const RegisterForm = () => {
  const router = useRouter();
  const { showAlert } = useAlert();

  const formik = useFormik({
    initialValues: {
      nombre_completo: "",
      email: "",
      rol: "student", // Valor predeterminado
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        // Enviamos nombre, correo y rol
        const userData = {
          nombre_completo: values.nombre_completo,
          email: values.email,
          rol: values.rol,
        };

        // Hace la llamada API con los campos requeridos
        const response = await axios.post(
          "http://127.0.0.1:8000/usuarios/registrar/",
          userData
        );

        if (response.status === 201) {
          // Muestra alerta de éxito
          showAlert({
            message: "¡Registro exitoso! Redirigiendo al inicio de sesión...",
            severity: "success",
          });

          // Resetea el formulario
          resetForm();

          // Redirecciona después de un breve retraso
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else {
          showAlert({
            message: "Error al registrar. Por favor, inténtalo de nuevo.",
            severity: "error",
          });
        }
      } catch (error) {
        // Manejo de errores detallado
        let errorMessage = "Error al registrar. Por favor, inténtalo de nuevo.";

        if (error.response) {
          if (error.response.status === 404) {
            errorMessage =
              "Error: No se pudo conectar con el servidor de registro.";
          } else if (error.response.data) {
            if (error.response.data.detail) {
              errorMessage = error.response.data.detail;
            } else if (typeof error.response.data === "string") {
              errorMessage = error.response.data;
            } else if (error.response.data.message) {
              errorMessage = error.response.data.message;
            } else {
              // Si hay un error de validación (común en Django REST Framework)
              const firstErrorKey = Object.keys(error.response.data)[0];
              if (
                firstErrorKey &&
                Array.isArray(error.response.data[firstErrorKey])
              ) {
                errorMessage = `${firstErrorKey}: ${error.response.data[firstErrorKey][0]}`;
              }
            }
          }
        } else if (error.request) {
          errorMessage =
            "No se recibió respuesta del servidor. Verifica tu conexión a internet.";
        } else if (error.message) {
          errorMessage = `Error: ${error.message}`;
        }

        showAlert({
          message: errorMessage,
          severity: "error",
        });
      }
      setSubmitting(false);
    },
  });

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
          Registrarse
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
          {/* Campo de Nombre Completo */}
          <FormControl>
            <StyledFormLabel htmlFor="nombre_completo">
              Nombre completo
            </StyledFormLabel>
            <StyledTextField
              id="nombre_completo"
              type="text"
              name="nombre_completo"
              placeholder="Ingresa tu nombre completo"
              fullWidth
              variant="outlined"
              {...formik.getFieldProps("nombre_completo")}
              error={
                formik.touched.nombre_completo &&
                Boolean(formik.errors.nombre_completo)
              }
              helperText={
                formik.touched.nombre_completo && formik.errors.nombre_completo
              }
            />
          </FormControl>

          {/* Campo de Correo Electrónico */}
          <FormControl>
            <StyledFormLabel htmlFor="email">
              Correo electrónico
            </StyledFormLabel>
            <StyledTextField
              id="email"
              type="email"
              name="email"
              placeholder="Ingresa tu correo electrónico"
              fullWidth
              variant="outlined"
              {...formik.getFieldProps("email")}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </FormControl>

          {/* Selección de Rol */}
          <FormControl>
            <StyledFormLabel id="rol-label">Tipo de cuenta</StyledFormLabel>
            <RadioGroup
              aria-labelledby="rol-label"
              name="rol"
              value={formik.values.rol}
              onChange={formik.handleChange}
              row
              sx={{ justifyContent: "space-around", mt: 1 }}
            >
              <FormControlLabel
                value="student"
                control={<StyledRadio />}
                label="Estudiante"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontWeight: formik.values.rol === "student" ? "600" : "400",
                    color: theme.text,
                  },
                }}
              />
              <FormControlLabel
                value="teacher"
                control={<StyledRadio />}
                label="Profesor"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontWeight: formik.values.rol === "teacher" ? "600" : "400",
                    color: theme.text,
                  },
                }}
              />
            </RadioGroup>
            {formik.touched.rol && formik.errors.rol && (
              <Typography color="error" variant="caption">
                {formik.errors.rol}
              </Typography>
            )}
          </FormControl>

          {/* Botón de Registro */}
          <StyledButton
            type="submit"
            fullWidth
            variant="contained"
            disabled={formik.isSubmitting}
          >
            Registrarse
          </StyledButton>
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

        {/* Enlace para iniciar sesión */}
        <Typography sx={{ textAlign: "center", mt: 1, color: theme.secondary }}>
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
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
            Inicia sesión
          </Link>
        </Typography>
      </Card>
    </SignInContainer>
  );
};

export default RegisterForm;
