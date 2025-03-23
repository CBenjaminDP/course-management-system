"use client";

import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthorizationProvider";
import { TextField, Button, Box, Typography, Link, IconButton, InputAdornment, Divider, Stack, FormControl, FormLabel, Checkbox, FormControlLabel } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { styled } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Esquema de validación con Yup
const validationSchema = Yup.object({
  height: '100vh',
  minHeight: '100%',
  email: Yup.string()
    .email("Correo inválido")
    .required("El correo es obligatorio"),
  password: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(/[a-zA-Z]/, "Debe contener al menos una letra")
    .matches(/[0-9]/, "Debe contener al menos un número")
    .required("La contraseña es obligatoria"),
});

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await login(values.email, values.password);
      } catch (error) {
        setErrors({ password: "Usuario o contraseña incorrectos." });
      }
      setSubmitting(false);
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <SignInContainer direction="column" justifyContent="space-between">
      {/* Botón de regresar */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleGoBack}
        sx={{ alignSelf: 'flex-start', mb: 2 }}
      >
        Regresar al inicio
      </Button>

      <Card variant="outlined">
        {/* Logo */}
        <Box sx={{ mb: 0, textAlign: 'center' }}>
          <Image
            src="/logo.png"
            alt="Logo"
            width={180}
            height={180}
          />
        </Box>

        {/* Título */}
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center' }}
        >
          Iniciar sesión
        </Typography>

        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2,
          }}
        >
          {/* Campo de Correo */}
          <FormControl>
            <FormLabel htmlFor="email">Correo electrónico</FormLabel>
            <TextField
              id="email"
              type="email"
              name="email"
              placeholder="correo electrónico"
              autoComplete="email"
              fullWidth
              variant="outlined"
              {...formik.getFieldProps("email")}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </FormControl>

          {/* Campo de Contraseña */}
          <FormControl>
            <FormLabel htmlFor="password">Contraseña</FormLabel>
            <TextField
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
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
                      sx={{ color: "#666" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>

          {/* Recordar contraseña */}
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Recordar contraseña"
          />

          {/* Botón de inicio de sesión */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={formik.isSubmitting}
          >
            Iniciar sesión
          </Button>

          {/* Olvidé mi contraseña */}
          <Link
            component="button"
            type="button"
            variant="body2"
            sx={{ alignSelf: 'center' }}
          >
            Olvidé mi contraseña
          </Link>
        </Box>

        {/* Divider */}
        <Divider>o</Divider>

        {/* Enlace para registrarse */}
        <Typography sx={{ textAlign: 'center', mt: 2 }}>
          ¿No tienes una cuenta?{" "}
          <Link
            href="/registro"
            variant="body2"
            sx={{ alignSelf: 'center' }}
          >
            Regístrate
          </Link>
        </Typography>
      </Card>
    </SignInContainer>
  );
};

export default LoginForm;