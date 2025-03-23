import json
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from .models import Usuario
from .forms import UsuarioForm
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt
from uuid import UUID

@api_view(['GET'])
@permission_classes([IsAuthenticated])
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

@csrf_exempt
def registrar_usuario(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            usuario = Usuario.objects.create_user(
                username=data['username'],
                password=data['password'],
                nombre_completo=data['nombre_completo'],
                email=data['email'],
                rol=data['rol']
            )
            return JsonResponse({'mensaje': 'Usuario creado correctamente', 'id': usuario.id}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def actualizar_usuario(request, id):
    if request.method == 'PUT':
        usuario = get_object_or_404(Usuario, id=id)
        try:
            data = json.loads(request.body)
            
            # Update only if field is present in request
            if 'username' in data:
                usuario.username = data['username']
            if 'password' in data:
                usuario.set_password(data['password'])
            if 'nombre_completo' in data:
                usuario.nombre_completo = data['nombre_completo']
            if 'email' in data:
                usuario.email = data['email']
            if 'rol' in data:
                usuario.rol = data['rol']
            if 'is_active' in data:
                usuario.is_active = data['is_active']
            
            usuario.save()

            return JsonResponse({
                'mensaje': 'Usuario actualizado correctamente',
                'usuario': {
                    'id': usuario.id,
                    'username': usuario.username,
                    'nombre_completo': usuario.nombre_completo,
                    'email': usuario.email,
                    'rol': usuario.rol,
                    'is_active': usuario.is_active,
                    'fecha_creacion': usuario.fecha_creacion
                }
            }, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_usuario(request, id):
    try:
        # Convertir el ID a UUID válido
        if len(id) == 32:  # UUID sin guiones
            formatted_id = f"{id[:8]}-{id[8:12]}-{id[12:16]}-{id[16:20]}-{id[20:]}"
        else:
            formatted_id = id
            
        usuario = get_object_or_404(Usuario, id=formatted_id)
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
        return JsonResponse(data, safe=False, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return JsonResponse({
        'message': 'This is a protected view',
        'user': request.user.username,
        'rol': request.user.rol
    })


@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def desactivar_usuario(request, id):
    if request.method == 'PUT':
        try:
            usuario = get_object_or_404(Usuario, id=id)
            usuario.is_active = not usuario.is_active
            usuario.save()
            status_message = 'activado' if usuario.is_active else 'desactivado'
            return JsonResponse({
                'mensaje': f'Usuario {status_message} correctamente',
                'is_active': usuario.is_active
            }, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

def format_uuid(uuid_string):
    """Helper function to handle UUIDs with or without hyphens"""
    # Remove any existing hyphens
    clean_uuid = uuid_string.replace('-', '')
    # Insert hyphens in correct positions
    formatted_uuid = f"{clean_uuid[:8]}-{clean_uuid[8:12]}-{clean_uuid[12:16]}-{clean_uuid[16:20]}-{clean_uuid[20:]}"
    return formatted_uuid
