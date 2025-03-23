import json
from django.shortcuts import render
from django.http import JsonResponse
from .models import Unidad
from .forms import UnidadForm
from django.shortcuts import redirect
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from cursos.models import Curso  # Agrega esta importación
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

#Metodo que devuelve el JSON
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_unidades(request):
    #Obtener todas la instancias del objeto de la BD
    unidades = Unidad.objects.all()
    #Crear una variable en formato de diccionario por que le JSONResponse necesita un diccionario
    data = [
        {
            'id': unidad.id,
            'nombre': unidad.nombre,
            'curso': {
                'id': unidad.curso.id,
                'nombre': unidad.curso.nombre
            },
            'orden': unidad.orden
        }
        for unidad in unidades
    ]
    return JsonResponse(data, safe=False)

#Funcion que registre sin recargar la pagina osea sin hacer render
@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def registrar_unidad(request):
    #checar que estemos manejando un metodo POST
    if request.method == 'POST':
        #aqui se puede validar si hay sesion antes de hacer el registro
        try:
            #Obtener los datos del request
            data = json.loads(request.body)
            # Obtener la instancia de Curso usando el ID proporcionado
            curso_instance = Curso.objects.get(id=data['curso'])
            # Crear la instancia de Unidad con la instancia de Curso
            unidad = Unidad.objects.create(
                nombre=data['nombre'],
                curso=curso_instance,  # Usar la instancia de Curso aquí
                orden=data['orden']
            )
            return JsonResponse({'mensaje': 'Unidad creada correctamente', 'id': unidad.id}, status=201)
        except Curso.DoesNotExist:
            return JsonResponse({'error': 'Curso no encontrado'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

#Funcion que actualiza sin recargar la pagina osea sin hacer render
@csrf_exempt  # Add this decorator
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def actualizar_unidad(request, id):
    #checar que estemos manejando un metodo PUT
    if request.method == 'PUT':
        #Intentar actualizar el objeto
        #1) Obtener la entidad a actualizar
        #Parametros: modelo y id o identificador del objeto
        unidad = get_object_or_404(Unidad, id=id)
        try:
            #2) Obtener los datos del body request
            data = json.loads(request.body)
            #3) Obtener la instancia de Curso usando el ID proporcionado
            curso_instance = Curso.objects.get(id=data['curso'])
            #4) Actualizar cada campo disponible de la entidad 
            unidad.nombre = data['nombre']
            unidad.curso = curso_instance  # Usar la instancia de Curso aquí
            unidad.orden = data['orden']
            unidad.save()  # Se agregó para asegurar que los cambios se guarden en la BD

            return JsonResponse({'mensaje': 'Unidad actualizada correctamente'}, status=200)
        except Curso.DoesNotExist:
            return JsonResponse({'error': 'Curso no encontrado'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

#Funcion que elimina sin recargar la pagina osea sin hacer render
@csrf_exempt  # Add this decorator
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def eliminar_unidad(request, id):
    #checar que estemos manejando un metodo DELETE
    if request.method == 'DELETE':
        #Intentar eliminar el objeto
        try:
            #1) Obtener la entidad a eliminar
            #Parametros: modelo y id o identificador del objeto
            unidad = get_object_or_404(Unidad, id=id)
            #2) Eliminar la entidad
            unidad.delete()
            #3) Retornar un JSON
            return JsonResponse({'mensaje': 'Unidad eliminada correctamente'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

#Funcion que obtiene un objeto sin recargar la pagina osea sin hacer render
@csrf_exempt  # Add this decorator
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_unidad(request, id):
    #checar que estemos manejando un metodo GET
    if request.method == 'GET':
        try:
            #1) Obtener la entidad a eliminar
            #Parametros: modelo y id o identificador del objeto
            unidad = get_object_or_404(Unidad, id=id)
            #2) Crear un diccionario con los datos de la entidad
            data = {
                'id': unidad.id,
                'nombre': unidad.nombre,
                'curso': unidad.curso.id,  # Use curso.id instead of curso object
                'orden': unidad.orden
            }
            #3) Retornar un JSON
            return JsonResponse(data, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

