export const MENU_OPTIONS = {
  admin: [
    {
      label: "Usuarios",
      url: "/admin/manage/users",
      subPages: [
        { label: "Profesores", url: "/admin/manage/users/profesores" },
        { label: "Alumnos", url: "/admin/manage/users/alumnos" },
      ],
    },
    {
      label: "Cursos",
      url: "/admin/manage/courses",
      subPages: [
        { label: "Todos", url: "/admin/manage/courses/all" },
        { label: "Inscripciones", url: "/admin/manage/courses/enrollments" },
      ],
    },
    {
      label: "Configuración",
      url: "/admin/manage/configuration",
    },
  ],
  teacher: [
    {
      label: "Mis Cursos",
      url: "/teacher/assignments/courses/manage",
      subPages: [
        { label: "Gestionar", url: "/teacher/courses/manage" },
        { label: "Calificaciones", url: "/teacher/courses/grades" },
      ],
    },
    {
      label: "Tareas",
      url: "/teacher/assignments",
    },
  ],
  student: [
    {
      label: "Mis Cursos",
      url: "/student/courses",
    },
    {
      label: "Tareas Pendientes",
      url: "/student/assignments",
    },
    {
      label: "Calificaciones",
      url: "/student/grades",
    },
    {
      label: "Cursos Aprobados",
      url: "/student/passed-courses",
    },
  ],
};

export const PROTECTED_ROUTES = {
  admin: [
    "/",
    "/dashboard",
    "/admin/manage/users",
    "/admin/manage/users/profesores",
    "/admin/manage/users/alumnos",
    "/admin/manage/configuration",
    "/admin/manage/courses",
    "/admin/manage/courses/all",
    "/admin/manage/courses/enrollments",
  ],
  teacher: [
    "/",
    "/dashboard",
    "/profesor/courses",
    "/profesor/courses/manage",
    "/profesor/courses/grades",
    "/profesor/assignments",
  ],
  student: [
    "/",
    "/dashboard",
    "/alumno/courses",
    "/alumno/assignments",
    "/alumno/grades",
  ],
};