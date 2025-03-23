from django.urls import path
from . import views

urlpatterns = [
    path('', views.listar_usuarios, name='listar_usuarios'),
    path('todos/', views.listar_usuarios, name='listar_todos_usuarios'),
    path('registrar/', views.registrar_usuario, name='registrar_usuario'),
    path('uuid/<uuid:id>/', views.obtener_usuario, name='obtener_usuario_uuid'),
    path('<int:id>/', views.obtener_usuario, name='obtener_usuario'),
    path('actualizar/<uuid:id>/', views.actualizar_usuario, name='actualizar_usuario'),
    path('eliminar/<int:id>/', views.eliminar_usuario, name='eliminar_usuario'),
    path('desactivar/<uuid:id>/', views.desactivar_usuario, name='desactivar_usuario'),  # New route
]

