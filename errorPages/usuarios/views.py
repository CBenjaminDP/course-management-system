import json
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from .models import Usuario
from .forms import UsuarioForm

def listar_usuarios(request):
    usuarios = Usuario.objects.all()
    data = [
        {
            'id': usuario.id,
            'username': usuario.username,
            'password': usuario.password,
            'nombre_completo': usuario.nombre_completo,
            'email': usuario.email,
            'rol': usuario.rol,
            'token': usuario.token,
            'fecha_creacion': usuario.fecha_creacion
        } 
        for usuario in usuarios
    ]
    return JsonResponse(data, safe=False)

def registrar_usuario(request):
    if request.method == 'POST':
        #aqui se puede validar si hay sesion antes de hacer el registro
        try:
            data = json.loads(request.body)
            usuario = Usuario.objects.create(
                username=data['username'],
                password=data['password'],
                nombre_completo=data['nombre_completo'],
                email=data['email'],
                rol=data['rol'],
                token=data['token']
            )
            return JsonResponse({'mensaje': 'Usuario creado correctamente', 'id': usuario.id}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

def actualizar_usuario(request, id):
    if request.method == 'PUT':
        #Intentar actualizar el objeto
        #1) Obtener la entidad a actualizar
        #Parametros: modelo y id o identificador del objeto
        usuario = get_object_or_404(Usuario, id=id)
        try:
            data = json.loads(request.body)
            usuario.username = data['username']
            usuario.password = data['password']
            usuario.nombre_completo = data['nombre_completo']
            usuario.email = data['email']
            usuario.rol = data['rol']
            usuario.token = data['token']
            usuario.save()  # Se agregó para asegurar que los cambios se guarden en la BD

            return JsonResponse({'mensaje': 'Usuario actualizado correctamente'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

def eliminar_usuario(request, id):
    if request.method == 'DELETE':
        #Intentar eliminar el objeto
        #1) Obtener la entidad a eliminar
        #Parametros: modelo y id o identificador del objeto
        usuario = get_object_or_404(Usuario, id=id)
        try:
            usuario.delete()
            return JsonResponse({'mensaje': 'Usuario eliminado correctamente'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

def obtener_usuario(request, id):
    if request.method == 'GET':
        try:
            usuario = get_object_or_404(Usuario, id=id)
            data = {
                'id': usuario.id,
                'username': usuario.username,
                'password': usuario.password,
                'nombre_completo': usuario.nombre_completo,
                'email': usuario.email,
                'rol': usuario.rol,
                'token': usuario.token,
                'fecha_creacion': usuario.fecha_creacion
            }
            return JsonResponse(data, safe=False, status=200)  # Agregado safe=False
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)
