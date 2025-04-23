export const MENU_OPTIONS = {
  admin: [
    {
      label: "Inicio",
      url: "/dashboard", 
    },
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
      label: "Materiales del Curso",
      url: "/admin/manage/courses",
      subPages: [
        { label: "Cursos", url: "/admin/manage/courses/" },
      ],
    },
  ],
  teacher: [
    {
      label: "Inicio",
      url: "/dashboard", 
    },
    {
      label: "Mis Cursos",
      url: "/teacher/courses/manage",
    },
  ],
  student: [
    {
      label: "Inicio",
      url: "/dashboard", 
    },
    {
      label: "Mis Cursos",
      url: "/student/courses",
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
    // In PROTECTED_ROUTES.admin array, add:
      "/admin/manage/courses/units",
      "/admin/manage/courses/:courseId/unidades",
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