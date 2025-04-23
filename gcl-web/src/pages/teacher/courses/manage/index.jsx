import React, { useState } from "react";
import { Container } from "@mui/material";
import DashboardLayout from "../../../../layouts/DashboardLayout"; // Asegúrate de que esta ruta sea correcta
import CrudCoursesTeacher from "../../../../components/Teacher/CrudCoursesTeacher";
import UnitsManager from "../../../../components/Teacher/UnitsManager";
import TopicsManager from "../../../../components/Teacher/TopicsManager";
import TasksManager from "../../../../components/Teacher/TasksManager";

const CoursesManagement = () => {
  // Estados para manejar la navegación
  const [currentView, setCurrentView] = useState("courses"); // courses, units, topics, tasks
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Nombres para mostrar en breadcrumbs y títulos
  const [courseName, setCourseName] = useState("");
  const [unitName, setUnitName] = useState("");
  const [topicName, setTopicName] = useState("");

  // Manejadores de navegación
  const handleViewUnits = (courseId, name) => {
    setSelectedCourse(courseId);
    setCourseName(name);
    setCurrentView("units");
  };

  const handleViewTopics = (unitId, name) => {
    setSelectedUnit(unitId);
    setUnitName(name);
    setCurrentView("topics");
  };

  const handleViewTasks = (topicId, name) => {
    setSelectedTopic(topicId);
    setTopicName(name);
    setCurrentView("tasks");
  };

  // Manejadores para volver atrás
  const handleBackToCourses = () => {
    setCurrentView("courses");
    setSelectedCourse(null);
    setSelectedUnit(null);
    setSelectedTopic(null);
  };

  const handleBackToUnits = () => {
    setCurrentView("units");
    setSelectedUnit(null);
    setSelectedTopic(null);
  };

  const handleBackToTopics = () => {
    setCurrentView("topics");
    setSelectedTopic(null);
  };

  // Renderizado condicional basado en el estado actual
  const renderCurrentView = () => {
    switch (currentView) {
      case "units":
        return (
          <UnitsManager
            courseId={selectedCourse}
            courseName={courseName}
            onBack={handleBackToCourses}
            onViewTopics={handleViewTopics}
          />
        );
      case "topics":
        return (
          <TopicsManager
            courseId={selectedCourse}
            courseName={courseName}
            unitId={selectedUnit}
            unitName={unitName}
            onBack={handleBackToUnits}
            onViewTasks={handleViewTasks}
          />
        );
      case "tasks":
        return (
          <TasksManager
            courseId={selectedCourse}
            courseName={courseName}
            unitId={selectedUnit}
            unitName={unitName}
            topicId={selectedTopic}
            topicName={topicName}
            onBack={handleBackToTopics}
          />
        );
      case "courses":
      default:
        return <CrudCoursesTeacher onViewUnits={handleViewUnits} />;
    }
  };

  return (
    <DashboardLayout>
      <Container maxWidth="lg">{renderCurrentView()}</Container>
    </DashboardLayout>
  );
};

export default CoursesManagement;
