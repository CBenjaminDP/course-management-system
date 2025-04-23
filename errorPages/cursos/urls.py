from django.urls import path
from . import views
from .views import listar_cursos, registrar_curso, actualizar_curso, eliminar_curso, obtener_curso, cursos_por_profesor, detalle_curso

urlpatterns = [
    path('listar_cursos/', listar_cursos, name='listar_cursos'),
    path('registrar_curso/', registrar_curso, name='registrar_curso'),
    path('actualizar_curso/<str:id>/', actualizar_curso, name='actualizar_curso'),
    path('eliminar_curso/<str:id>/', eliminar_curso, name='eliminar_curso'),
    path('obtener_curso/<str:id>/', obtener_curso, name='obtener_curso'),
    path('profesor/<str:profesor_id>/', cursos_por_profesor, name='cursos_por_profesor'),
    path('detalle/<str:pk>/', detalle_curso, name='curso-detail'),
    path('detalle-completo/<str:pk>/', views.detalle_curso_completo, name='detalle_curso_completo'),


]
