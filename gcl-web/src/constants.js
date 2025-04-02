export const MENU_OPTIONS = {
  admin: [
    {
      label: "Usuarios",
      url: "/admin/manage/users",
      subPages: [
        { label: "Profesores", url: "/admin/manage/users/teachers" },
        { label: "Alumnos", url: "/admin/manage/users/students" },
        { label: "Administradores", url: "/admin/manage/users/admins" },
      ],
    },
    {
      label: "Cursos",
      url: "/admin/manage/courses",
      subPages: [
        { label: "Todos", url: "/admin/manage/courses/" },
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
      label: "Cursos Completados",
      url: "/student/passed-courses",
    },
    {
      label: "Más Cursos",
      url: "/student/more-courses",
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