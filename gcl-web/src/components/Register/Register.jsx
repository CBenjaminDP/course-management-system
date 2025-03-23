"use client";

import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthorizationProvider";
import { TextField, Button, Box, Typography, Link, IconButton, InputAdornment, Divider, Stack, FormControl, FormLabel, Checkbox, FormControlLabel, MenuItem, Select } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { styled } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Icono de regresar

// Esquema de validación con Yup
const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .required("El nombre de usuario es obligatorio"),
  password: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(/[a-zA-Z]/, "Debe contener al menos una letra")
    .matches(/[0-9]/, "Debe contener al menos un número")
    .required("La contraseña es obligatoria"),
  nombre_completo: Yup.string()
    .required("El nombre completo es obligatorio"),
  email: Yup.string()
    .email("Correo inválido")
    .required("El correo es obligatorio"),
  rol: Yup.string()
    .required("El rol es obligatorio"),
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

const RegisterForm = () => {
  const { register } = useContext(AuthContext); // Asume que tienes una función `register` en tu contexto
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      nombre_completo: "",
      email: "",
      rol: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await register(values); // Llama a la función de registro con los valores del formulario
      } catch (error) {
        setErrors({ password: "Error al registrar. Inténtalo de nuevo." });
      }
      setSubmitting(false);
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleGoBack = () => {
    // Lógica para regresar (puedes usar un router si estás en una SPA)
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
            src="/logo.png" // Reemplaza con la ruta de tu imagen
            alt="Logo"
            width={180} // Ajusta el ancho según sea necesario
            height={180} // Ajusta la altura según sea necesario
          />
        </Box>

        {/* Título */}
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center' }}
        >
          Registrarse
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
          {/* Campo de Nombre de Usuario */}
          <FormControl>
            <FormLabel htmlFor="username">Nombre de usuario</FormLabel>
            <TextField
              id="username"
              type="text"
              name="username"
              placeholder="Nombre de usuario"
              fullWidth
              variant="outlined"
              {...formik.getFieldProps("username")}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
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

          {/* Campo de Nombre Completo */}
          <FormControl>
            <FormLabel htmlFor="nombre_completo">Nombre completo</FormLabel>
            <TextField
              id="nombre_completo"
              type="text"
              name="nombre_completo"
              placeholder="Nombre completo"
              fullWidth
              variant="outlined"
              {...formik.getFieldProps("nombre_completo")}
              error={formik.touched.nombre_completo && Boolean(formik.errors.nombre_completo)}
              helperText={formik.touched.nombre_completo && formik.errors.nombre_completo}
            />
          </FormControl>

          {/* Campo de Correo Electrónico */}
          <FormControl>
            <FormLabel htmlFor="email">Correo electrónico</FormLabel>
            <TextField
              id="email"
              type="email"
              name="email"
              placeholder="correo electrónico"
              fullWidth
              variant="outlined"
              {...formik.getFieldProps("email")}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </FormControl>

          {/* Campo de Rol */}
          <FormControl>
            <FormLabel htmlFor="rol">Rol</FormLabel>
            <Select
              id="rol"
              name="rol"
              fullWidth
              variant="outlined"
              {...formik.getFieldProps("rol")}
              error={formik.touched.rol && Boolean(formik.errors.rol)}
            >
              <MenuItem value="usuario">Usuario</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
            </Select>
          </FormControl>

          {/* Botón de Registro */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={formik.isSubmitting}
          >
            Registrarse
          </Button>
        </Box>

        {/* Divider */}
        <Divider>o</Divider>

        {/* Enlace para iniciar sesión */}
        <Typography sx={{ textAlign: 'center', mt: 2 }}>
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/iniciar-sesion"
            variant="body2"
            sx={{ alignSelf: 'center' }}
          >
            Inicia sesión
          </Link>
        </Typography>
      </Card>
    </SignInContainer>
  );
};

export default RegisterForm;