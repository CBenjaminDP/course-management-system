"use client";

import { useContext } from "react";
import { AuthContext } from "../../context/AuthorizationProvider";
import { TextField, Button, Box, Typography, Link } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image"; // Importa el componente Image de Next.js

// Esquema de validación con Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Correo inválido")
    .required("El correo es obligatorio"),
  password: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(/[a-zA-Z]/, "Debe contener al menos una letra")
    .matches(/[0-9]/, "Debe contener al menos un número")
    .required("La contraseña es obligatoria"),
});

const LoginForm = () => {
  const { login } = useContext(AuthContext);

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

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{
        width: "100%",
        maxWidth: 400,
        mx: "auto",
        p: 4,
        backgroundColor: "#F3F3F3",
        borderRadius: 4,
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      {/* Logo */}
      <Box sx={{ mb: 3 }}>
        <Image
          src="/logo.png" // Reemplaza con la ruta de tu imagen
          alt="Logo"
          width={150} // Ajusta el ancho según sea necesario
          height={200} // Ajusta la altura según sea necesario
        />
      </Box>

      {/* Título */}
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        Iniciar sesión
      </Typography>

      {/* Campo de Correo */}
      <Box sx={{ textAlign: "left", mb: 2 }}>
        <Typography sx={{ fontWeight: "medium", mb: 0.5 }}>
          Correo electrónico
        </Typography>
        <TextField
          placeholder="correo electrónico"
          variant="outlined"
          fullWidth
          {...formik.getFieldProps("email")}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
      </Box>

      {/* Campo de Contraseña */}
      <Box sx={{ textAlign: "left", mb: 1 }}>
        <Typography sx={{ fontWeight: "medium", mb: 0.5 }}>
          Contraseña
        </Typography>
        <TextField
          type="password"
          placeholder="Contraseña"
          variant="outlined"
          fullWidth
          {...formik.getFieldProps("password")}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
      </Box>

      {/* Olvidé mi contraseña */}
      <Box sx={{ textAlign: "right", mb: 3 }}>
        <Link href="#" sx={{ fontSize: 14, color: "#2D72F3" }}>
          Olvidé mi contraseña
        </Link>
      </Box>

      {/* Botón de inicio de sesión */}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={formik.isSubmitting}
        sx={{
          backgroundColor: "#6B6B6B",
          color: "white",
          fontWeight: "bold",
          py: 1.5,
          boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
          "&:hover": { backgroundColor: "#5A5A5A" },
        }}
      >
        Iniciar sesión
      </Button>
    </Box>
  );
};

export default LoginForm;
