import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Divider,
  styled,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { Download, CheckCircle, EmojiEvents } from "@mui/icons-material";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const theme = {
  primary: "#FFD700",
  secondary: "#4A4A4A",
  accent: "#F5F5F5",
  text: "#333333",
  white: "#FFFFFF",
  hover: "#E6C200",
  success: "#22c55e",
};

const StyledButton = styled(Button)(() => ({
  borderRadius: "8px",
  padding: "10px 20px",
  textTransform: "none",
  fontWeight: "600",
  backgroundColor: theme.primary,
  color: theme.text,
  boxShadow: "none",
  transition: "all 0.3s",
  marginTop: "16px",
  "&:hover": {
    backgroundColor: theme.hover,
    boxShadow: "0 4px 12px rgba(255, 215, 0, 0.3)",
    transform: "scale(1.02)",
  },
}));

const SimpleCertificate = ({
  userName = "",
  courseName = "",
  completionDate = new Date(),
  instructorName = "",
}) => {
  const certificateRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const formattedDate = completionDate.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    setLoading(true);
    try {
      const scale = 2;
      const canvas = await html2canvas(certificateRef.current, {
        scale,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(
        pdfWidth / canvas.width,
        pdfHeight / canvas.height
      );
      const imgX = (pdfWidth - canvas.width * ratio) / 2;
      const imgY = (pdfHeight - canvas.height * ratio) / 2;
      pdf.addImage(
        imgData,
        "JPEG",
        imgX,
        imgY,
        canvas.width * ratio,
        canvas.height * ratio
      );
      pdf.save(`Certificado_${courseName.replace(/\s+/g, "_")}.pdf`);
      setLoading(false);
    } catch (err) {
      console.error("Error al generar el PDF:", err);
      setError(
        "Error al descargar el certificado: " +
          (err.message || "Error desconocido")
      );
      setShowAlert(true);
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, width: "95%", overflowX: "auto" }}>
      <Paper elevation={3} sx={{ p: 2, borderRadius: "12px", mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <CheckCircle sx={{ color: theme.success, mr: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            ¡Felicidades! Has completado este curso al 100%
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Ya puedes descargar tu certificado de finalización y compartirlo con
          quien desees.
        </Typography>
        <StyledButton
          onClick={downloadCertificate}
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <Download />
            )
          }
          disabled={loading}
        >
          {loading ? "Generando PDF..." : "Descargar Certificado"}
        </StyledButton>
      </Paper>

      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => setShowAlert(false)}
      >
        <Alert
          onClose={() => setShowAlert(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Box
        ref={certificateRef}
        sx={{
          width: "100%",
          maxWidth: "100%",
          minWidth: "320px",
          height: { xs: "auto", md: "600px" },
          p: { xs: 2, sm: 4, md: 8 },
          border: `1px solid ${theme.primary}`,
          borderRadius: "12px",
          position: "relative",
          overflow: "hidden",
          backgroundColor: theme.white,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mb: 4,
          backgroundImage:
            "radial-gradient(circle, rgba(255,215,0,0.05) 0%, rgba(255,255,255,1) 70%)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "15px",
            backgroundColor: theme.primary,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "15px",
            backgroundColor: theme.primary,
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 15,
            left: 15,
            right: 15,
            bottom: 15,
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: "8px",
            pointerEvents: "none",
          }}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <EmojiEvents sx={{ fontSize: 45, color: theme.primary, mr: 2 }} />
          <Typography variant="h4" sx={{ color: theme.text, fontWeight: 700 }}>
            CERTIFICADO DE FINALIZACIÓN
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ mb: 4, color: theme.secondary }}>
          Este certificado acredita que
        </Typography>

        <Typography
          variant="h4"
          sx={{
            mb: 3,
            fontWeight: 700,
            color: theme.text,
            border: `2px solid ${theme.primary}`,
            borderRadius: "8px",
            px: 4,
            py: 1,
            textAlign: "center",
          }}
        >
          {userName}
        </Typography>

        <Typography variant="body1" sx={{ mb: 2, color: theme.secondary }}>
          ha completado exitosamente el curso
        </Typography>

        <Typography
          variant="h5"
          sx={{
            mb: 4,
            fontWeight: 600,
            textAlign: "center",
            color: theme.secondary,
            maxWidth: "80%",
          }}
        >
          {courseName}
        </Typography>

        <Divider sx={{ width: "60%", mb: 4 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 4,
            width: { xs: "100%", sm: "90%", md: "70%" },
            mt: 2,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: theme.secondary, mb: 1 }}>
              Fecha de finalización
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {formattedDate}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: theme.secondary, mb: 1 }}>
              Instructor
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {instructorName}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SimpleCertificate;
