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
  profesor: [
    {
      label: "Mis Cursos",
      url: "/teacher/courses",
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
  alumno: [
    {
      label: "Mis Cursos",
      url: "/alumno/courses",
    },
    {
      label: "Tareas Pendientes",
      url: "/alumno/assignments",
    },
    {
      label: "Calificaciones",
      url: "/alumno/grades",
    },
  ],
};

export const PROTECTED_ROUTES = {
  admin: [
    "/",
    "/admin/manage/users",
    "/admin/manage/users/profesores",
    "/admin/manage/users/alumnos",
    "/admin/manage/configuration",
    "/admin/manage/courses",
    "/admin/manage/courses/all",
    "/admin/manage/courses/enrollments",
  ],
  profesor: [
    "/",
    "/profesor/courses",
    "/profesor/courses/manage",
    "/profesor/courses/grades",
    "/profesor/assignments",
  ],
  alumno: [
    "/",
    "/alumno/courses",
    "/alumno/assignments",
    "/alumno/grades",
  ],
};