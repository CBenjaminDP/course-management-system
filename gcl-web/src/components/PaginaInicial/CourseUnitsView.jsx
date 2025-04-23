"use client";

import React, { useState } from "react";
import {
  Typography,
  Box,
  Chip,
  Collapse,
  Paper,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// Paleta de colores basada en el logo
const theme = {
  primary: "#FFD700", // Amarillo/dorado del logo
  secondary: "#4A4A4A", // Gris oscuro para contraste
  accent: "#F5F5F5", // Gris claro para fondos
  text: "#333333", // Casi negro para texto
  white: "#FFFFFF", // Blanco puro
  hover: "#E6C200", // Amarillo más oscuro para hover
};

const CourseUnitsView = ({ units }) => {
  // Ordenar las unidades por el campo 'orden'
  const sortedUnits = [...units].sort((a, b) => a.orden - b.orden);

  return (
    <Box sx={{ my: 2 }}>
      {sortedUnits.map((unit) => (
        <UnitAccordion key={unit.id} unit={unit} />
      ))}
    </Box>
  );
};

const UnitAccordion = ({ unit }) => {
  const [expanded, setExpanded] = useState(false);

  // Ordenar los temas por el campo 'orden'
  const sortedTopics = [...unit.temas].sort((a, b) => a.orden - b.orden);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 2,
        border: `1px solid ${theme.accent}`,
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: expanded ? "rgba(255, 215, 0, 0.05)" : theme.white,
          borderBottom: expanded ? `1px solid ${theme.accent}` : "none",
          transition: "background-color 0.3s ease",
          "&:hover": {
            bgcolor: "rgba(255, 215, 0, 0.1)",
          },
          cursor: "pointer",
        }}
        onClick={handleToggle}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Chip
            label={`Unidad ${unit.orden}`}
            size="small"
            sx={{
              bgcolor: theme.primary,
              color: theme.text,
              fontWeight: "600",
              mr: 2,
            }}
          />
          <Typography variant="subtitle1" sx={{ fontWeight: "600" }}>
            {unit.nombre}
          </Typography>
        </Box>
        <IconButton
          sx={{
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s",
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </Box>

      <Collapse in={expanded} timeout="auto">
        <Box sx={{ p: 0 }}>
          {sortedTopics.map((topic, index) => (
            <TopicItem
              key={topic.id}
              topic={topic}
              isLast={index === sortedTopics.length - 1}
            />
          ))}
        </Box>
      </Collapse>
    </Paper>
  );
};

const TopicItem = ({ topic, isLast }) => {
  return (
    <Box sx={{ borderBottom: isLast ? "none" : `1px solid ${theme.accent}` }}>
      <Box
        sx={{
          p: 2,
          pl: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: theme.white,
          "&:hover": {
            bgcolor: "rgba(74, 74, 74, 0.05)",
          },
        }}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: "600" }}>
            {topic.nombre}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {topic.descripcion}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Chip
            size="small"
            label={`${topic.tareas.length} tareas`}
            sx={{
              bgcolor: "rgba(74, 74, 74, 0.1)",
              color: theme.secondary,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CourseUnitsView;
