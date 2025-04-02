import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Container,
  Collapse,
  CircularProgress
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FolderIcon from '@mui/icons-material/Folder';
import BookIcon from '@mui/icons-material/Book';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

const Assignments = () => {
  const [unidades, setUnidades] = useState([]);
  const [temas, setTemas] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [inscripciones, setInscripciones] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('accessToken');
        const headers = {
          'Authorization': `Bearer ${token}`
        };

        // Obtener usuario actual
        const userResponse = await axios.get('http://localhost:8000/usuarios/usuario-actual/', { headers });
        setCurrentUser(userResponse.data);

        // Obtener inscripciones del usuario
        const inscripcionesResponse = await axios.get('http://localhost:8000/inscripciones/', { headers });
        const misInscripciones = inscripcionesResponse.data.filter(
          inscripcion => inscripcion.id_usuario === userResponse.data.id
        );
        setInscripciones(misInscripciones);

        // Obtener datos filtrados por cursos inscritos
        const [unidadesRes, temasRes, tareasRes] = await Promise.all([
          axios.get('http://localhost:8000/unidades/', { headers }),
          axios.get('http://localhost:8000/temas/', { headers }),
          axios.get('http://localhost:8000/tareas/', { headers })
        ]);

        // Filtrar unidades por cursos inscritos
        const unidadesFiltradas = unidadesRes.data.filter(unidad => 
          misInscripciones.some(inscripcion => inscripcion.id_curso === unidad.curso.id)
        );

        setUnidades(unidadesFiltradas);
        setTemas(temasRes.data);
        setTareas(tareasRes.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [openUnits, setOpenUnits] = useState({});
  const [openTopics, setOpenTopics] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleTaskClick = (tarea) => {
    setSelectedTask(tarea);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
  };

  const handleUnitClick = (unitId) => {
    setOpenUnits(prev => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  const handleTopicClick = (topicId) => {
    setOpenTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tareas Pendientes
        </Typography>
        <Paper elevation={3}>
          <List>
            {unidades.map((unidad) => (
              <React.Fragment key={unidad.id}>
                <ListItem button onClick={() => handleUnitClick(unidad.id)}>
                  <ListItemIcon>
                    <FolderIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={`${unidad.nombre} - ${unidad.curso.nombre}`}
                  />
                  {openUnits[unidad.id] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openUnits[unidad.id]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {temas
                      .filter(tema => tema.unidad === unidad.nombre)
                      .map(tema => (
                        <React.Fragment key={tema.id}>
                          <ListItem 
                            button 
                            onClick={() => handleTopicClick(tema.id)}
                            sx={{ pl: 4 }}
                          >
                            <ListItemIcon>
                              <BookIcon color="secondary" />
                            </ListItemIcon>
                            <ListItemText primary={tema.nombre} />
                            {openTopics[tema.id] ? <ExpandLess /> : <ExpandMore />}
                          </ListItem>
                          <Collapse in={openTopics[tema.id]} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                              {tareas
                                .filter(tarea => tarea.tema === tema.nombre)
                                .map(tarea => (
                                  <ListItem 
                                    key={tarea.id} 
                                    sx={{ pl: 8 }}
                                    button
                                    onClick={() => handleTaskClick(tarea)}
                                  >
                                    <ListItemIcon>
                                      <AssignmentIcon color="info" />
                                    </ListItemIcon>
                                    <ListItemText 
                                      primary={tarea.titulo}
                                      secondary={`Fecha de entrega: ${new Date(tarea.fecha_entrega).toLocaleDateString()}`}
                                    />
                                  </ListItem>
                                ))}
                            </List>
                          </Collapse>
                        </React.Fragment>
                      ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedTask?.titulo}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            {selectedTask?.descripcion}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Tema: {selectedTask?.tema}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Fecha de entrega: {selectedTask && new Date(selectedTask.fecha_entrega).toLocaleDateString()}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Assignments;
