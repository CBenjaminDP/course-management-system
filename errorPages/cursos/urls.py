from django.urls import path
from .views import listar_cursos, registrar_curso, actualizar_curso, eliminar_curso, obtener_curso

urlpatterns = [
    path('listar_cursos/', listar_cursos, name='listar_cursos'),
    path('registrar_curso/', registrar_curso, name='registrar_curso'),
    path('actualizar_curso/<int:id>/', actualizar_curso, name='actualizar_curso'),
    path('eliminar_curso/<int:id>/', eliminar_curso, name='eliminar_curso'),
    path('obtener_curso/<int:id>/', obtener_curso, name='obtener_curso')
]
