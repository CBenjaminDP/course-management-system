import json
from django.shortcuts import render
from django.http import JsonResponse
from .models import Curso
from .forms import CursoForm
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from usuarios.models import Usuario
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from uuid import UUID

# Nuevas importaciones
from unidades.models import Unidad
from temas.models import Tema
from tareas.models import Tarea


#Metodo que devuelve el JSON
@api_view(['GET'])
# Removed @permission_classes([IsAuthenticated]) to allow public access
def listar_cursos(request):
    cursos = Curso.objects.all()
    data = [
        {
            'id': curso.id,
            'nombre': curso.nombre,
            'descripcion': curso.descripcion,
            'profesor': {
                'id': curso.profesor.id,
                'nombre': curso.profesor.username
            },
            'fecha_inicio': curso.fecha_inicio.isoformat() if curso.fecha_inicio else None,
            'fecha_fin': curso.fecha_fin.isoformat() if curso.fecha_fin else None,
            'estado': curso.estado,
            'imagen_url': curso.imagen_url,
        } 
        for curso in cursos
    ]
    return JsonResponse(data, safe=False)

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_curso(request, id):
    if request.method == 'GET':
        curso = get_object_or_404(Curso, id=id)
        try:
            data = {
                'id': curso.id,
                'nombre': curso.nombre,
                'descripcion': curso.descripcion,
                'profesor': {
                    'id': curso.profesor.id,
                    'nombre': curso.profesor.username,
                    'email': curso.profesor.email
                },
                'fecha_inicio': curso.fecha_inicio,
                'fecha_fin': curso.fecha_fin,
                'estado': curso.estado,
                'imagen_url': curso.imagen_url,
            }
            return JsonResponse(data, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

#Funcion que registre sin recargar la pagina osea sin hacer render 
@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def registrar_curso(request):
    #checar que estemos manejando un metodo POST
    if request.method == 'POST':
        #aqui se puede validar si hay sesion antes de hacer el registro
        try:
            #Obtener los datos del cuerpo de la peticion
            data = json.loads(request.body)
            #Crear una instancia del modelo Curso
            # Obtener la instancia del Usuario
            profesor = Usuario.objects.get(id=data['profesor'])
            
            curso = Curso.objects.create(
                nombre=data['nombre'],
                descripcion=data['descripcion'],
                profesor=profesor,  # Asignar la instancia del Usuario
                fecha_inicio=data['fecha_inicio'],
                fecha_fin=data['fecha_fin'],
                estado=data['estado'],
                imagen_url=data.get('imagen_url', None),
            )
            #Retornar un JSON con un mensaje de exito y el id del curso creado
            return JsonResponse({'mensaje': 'Curso creado correctamente', 'id': curso.id}, status=201)
        #Si hay un error
        except Usuario.DoesNotExist:
            return JsonResponse({'error': 'El profesor especificado no existe'}, status=400)
        except Exception as e:
            #Retornar un JSON con un mensaje de error
            return JsonResponse({'error': str(e)}, status=400)
    #Si el metodo no es POST
    return JsonResponse({'error': 'Método no permitido'}, status=405)


#Funcion que actualiza un curso
@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def actualizar_curso(request, id):
    #Si el metodo es PUT
    if request.method == 'PUT':
        #Obtener el curso a actualizar
        curso = get_object_or_404(Curso, id=id)
        try:
            #Obtener los datos del cuerpo de la peticion
            data = json.loads(request.body)
            # Obtener la instancia del Usuario (profesor)
            profesor = Usuario.objects.get(id=data['profesor'])
            
            curso.nombre = data['nombre']
            curso.descripcion = data['descripcion']
            curso.profesor = profesor  # Asignar la instancia del Usuario
            curso.fecha_inicio = data['fecha_inicio']
            curso.fecha_fin = data['fecha_fin']
            curso.estado = data['estado']
            curso.imagen_url = data.get('imagen_url', curso.imagen_url)
            curso.save()
            return JsonResponse({'mensaje': 'Curso actualizado correctamente'}, status=200)
        except Usuario.DoesNotExist:
            return JsonResponse({'error': 'El profesor especificado no existe'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)   


#Funcion que elimina un curso
@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def eliminar_curso(request, id):
    #Si el metodo es DELETE
    if request.method == 'DELETE':
        #Obtener el curso a eliminar
        curso = get_object_or_404(Curso, id=id)
        try:
            #Eliminar el curso
            curso.delete()
            #Retornar un JSON con un mensaje de exito
            return JsonResponse({'mensaje': 'Curso eliminado correctamente'}, status=200)
        #Si hay un error
        except Exception as e:
            #Retornar un JSON con un mensaje de error
            return JsonResponse({'error': str(e)}, status=400)
    #Si el metodo no es DELETE
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cursos_por_profesor(request, profesor_id):  # no hace falta cambiar tipo aquí si usas <str> o <uuid>
    try:
        profesor = Usuario.objects.get(id=profesor_id)
        cursos = Curso.objects.filter(profesor=profesor)
        data = [
            {
                'id': curso.id,
                'nombre': curso.nombre,
                'descripcion': curso.descripcion,
                'profesor': {
                    'id': curso.profesor.id,
                    'nombre': curso.profesor.username,
                },
                'fecha_inicio': curso.fecha_inicio.isoformat() if curso.fecha_inicio else None,
                'fecha_fin': curso.fecha_fin.isoformat() if curso.fecha_fin else None,
                'estado': curso.estado,
                'imagen_url': curso.imagen_url,
            }
            for curso in cursos
        ]
        return JsonResponse(data, safe=False)
    except Usuario.DoesNotExist:
        return JsonResponse({'error': 'Profesor no encontrado'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def detalle_curso(request, pk):
    
    if request.method == 'GET':
        try:
            curso = get_object_or_404(Curso, pk=pk)
            data = {
                'id': curso.id,
                'nombre': curso.nombre,
                'descripcion': curso.descripcion,
                'profesor': {
                    'id': curso.profesor.id,
                    'nombre': curso.profesor.username,
                    'email': curso.profesor.email
                },
                'fecha_inicio': curso.fecha_inicio.isoformat() if curso.fecha_inicio else None,
                'fecha_fin': curso.fecha_fin.isoformat() if curso.fecha_fin else None,
                'estado': curso.estado,
                'imagen_url': curso.imagen_url,
            }
            return JsonResponse(data, status=200)
        except Curso.DoesNotExist:
            return JsonResponse({'error': 'El curso no existe'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)



@csrf_exempt
@api_view(['GET'])
def detalle_curso_completo(request, pk):
    if request.method == 'GET':
        try:
            curso = get_object_or_404(Curso, pk=pk)
            unidades = Unidad.objects.filter(curso=curso).order_by('orden')

            unidades_data = []
            for unidad in unidades:
                temas = Tema.objects.filter(unidad=unidad).order_by('orden')
                temas_data = []
                for tema in temas:
                    tareas = Tarea.objects.filter(tema=tema)
                    tareas_data = [
                        {
                            'id': str(tarea.id),
                            'titulo': tarea.titulo,
                            'descripcion': tarea.descripcion,
                            'tipo': getattr(tarea, 'tipo', 'assignment'),
                            'fecha_entrega': tarea.fecha_entrega.isoformat() if tarea.fecha_entrega else None
                        }
                        for tarea in tareas
                    ]
                    temas_data.append({
                        'id': str(tema.id),
                        'nombre': tema.nombre,
                        'descripcion': tema.descripcion,
                        'orden': tema.orden,
                        'tareas': tareas_data
                    })
                unidades_data.append({
                    'id': str(unidad.id),
                    'nombre': unidad.nombre,
                    'orden': unidad.orden,
                    'temas': temas_data
                })

            data = {
                'id': curso.id,
                'nombre': curso.nombre,
                'descripcion': curso.descripcion,
                'profesor': {
                    'id': curso.profesor.id,
                    'nombre': curso.profesor.username,
                    'email': curso.profesor.email
                },
                'fecha_inicio': curso.fecha_inicio.isoformat() if curso.fecha_inicio else None,
                'fecha_fin': curso.fecha_fin.isoformat() if curso.fecha_fin else None,
                'estado': curso.estado,
                'imagen_url': curso.imagen_url,
                'unidades': unidades_data
            }

            return JsonResponse(data, status=200)

        except Curso.DoesNotExist:
            return JsonResponse({'error': 'El curso no existe'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Método no permitido'}, status=405)
