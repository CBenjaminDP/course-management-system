// CoursesContainer.jsx
import React, { useState } from "react";
import Courses from "./Courses";
import CourseContent from "./CourseContent";

const CoursesContainer = () => {
  const [currentView, setCurrentView] = useState("list");
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const handleViewCourse = (courseId) => {
    setSelectedCourseId(courseId);
    setCurrentView("content");
  };

  const handleBackToList = () => {
    setCurrentView("list");
  };

  return (
    <>
      {currentView === "list" ? (
        <Courses onCourseClick={handleViewCourse} />
      ) : (
        <CourseContent courseId={selectedCourseId} onBack={handleBackToList} />
      )}
    </>
  );
};

export default CoursesContainer;
