import json
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response

from .models import Inscripcion, TareaCompletada
from .forms import InscripcionForm
from cursos.models import Curso
from usuarios.models import Usuario
from tareas.models import Tarea

#Metodo que devuelve el JSON
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_inscripciones(request):
    inscripciones = Inscripcion.objects.all()
    data = [
        {
            'id': inscripcion.id,
            'id_curso': inscripcion.curso.id,  # Access the related curso's id
            'id_usuario': inscripcion.usuario.id,  # Access the related usuario's id
            'fecha_inscripcion': inscripcion.fecha_inscripcion
        } 
        for inscripcion in inscripciones
    ]
    return JsonResponse(data, safe=False)

#Funcion que registre sin recargar la pagina osea sin hacer render 
@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def registrar_inscripcion(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get the related objects
            from cursos.models import Curso
            from usuarios.models import Usuario
            curso = get_object_or_404(Curso, id=data['id_curso'])
            usuario = get_object_or_404(Usuario, id=data['id_usuario'])
            
            # Create the inscription with proper foreign key relationships
            inscripcion = Inscripcion.objects.create(
                curso=curso,
                usuario=usuario,
                fecha_inscripcion=data['fecha_inscripcion']
            )
            return JsonResponse({'mensaje': 'Inscripcion creada correctamente', 'id': inscripcion.id}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

#Funcion que actualiza sin recargar la pagina osea sin hacer render 
@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def actualizar_inscripcion(request, id):
    #checar que estemos manejando un metodo PUT
    if request.method == 'PUT':
        #Intentar actualizar el objeto
        #1) Obtener la entidad a actualizar
        #Parametros: modelo y id o identificador del objeto
        inscripcion = get_object_or_404(Inscripcion, id=id)
        try:
            #2) Obtener los datos del body request
            data = json.loads(request.body)
            #3) Actualizar cada campo disponible de la entidad 
            inscripcion.id_curso = data['id_curso']
            inscripcion.id_usuario = data['id_usuario']
            inscripcion.fecha_inscripcion = data['fecha_inscripcion']
            #4) Guardar los cambios
            inscripcion.save()  # Se agregó para asegurar que los cambios se guarden en la BD

            #5)Retornar un JSON
            return JsonResponse({'mensaje': 'Inscripcion actualizada correctamente'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)


#Funcion que elimina sin recargar la pagina osea sin hacer render
@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def eliminar_inscripcion(request, id):
    #checar que estemos manejando un metodo DELETE
    if request.method == 'DELETE':
        #Intentar eliminar el objeto
        #1) Obtener la entidad a eliminar
        #Parametros: modelo y id o identificador del objeto
        inscripcion = get_object_or_404(Inscripcion, id=id)
        try:
            #2) Eliminar la entidad
            inscripcion.delete()
            #3) Retornar un mensaje de exito
            return JsonResponse({'mensaje': 'Inscripcion eliminada correctamente'}, status=200)
        except Exception as e:
            #4) Retornar un mensaje de error
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

#Funcion que obtiene un objeto sin recargar la pagina osea sin hacer render
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_inscripcion(request, id):
    #checar que estemos manejando un metodo GET
    if request.method == 'GET':
        #Intentar obtener el objeto
        #1) Obtener la entidad a obtener
        #Parametros: modelo y id o identificador del objeto
        inscripcion = get_object_or_404(Inscripcion, id=id)
        try:
            #2) Crear un diccionario con los datos de la entidad
            data = {
                'id': inscripcion.id,
                'id_curso': inscripcion.curso.id,  # Access the related curso's id
                'id_usuario': inscripcion.usuario.id,  # Access the related usuario's id
                'fecha_inscripcion': inscripcion.fecha_inscripcion
            }
            #3) Retornar un JSON
            return JsonResponse(data, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def marcar_tarea_completada(request):
    tarea_id = request.data.get('tarea_id')
    curso_id = request.data.get('curso_id')
    
    print(f"Datos recibidos: tarea_id={tarea_id}, curso_id={curso_id}")
    print(f"Tipos de datos: tipo tarea_id={type(tarea_id)}, tipo curso_id={type(curso_id)}")
    
    try:
        # Verificar que el usuario esté inscrito en el curso
        inscripcion = Inscripcion.objects.get(
            usuario=request.user,
            curso_id=curso_id
        )
        
        # Verificar que la tarea exista y pertenezca al curso
        tarea = Tarea.objects.select_related('tema__unidad').get(id=tarea_id)
        
        # Agregar logs para depurar
        tarea_curso_id = tarea.tema.unidad.curso_id
        print(f"ID del curso de la tarea: {tarea_curso_id}, tipo={type(tarea_curso_id)}")
        print(f"ID del curso proporcionado: {curso_id}, tipo={type(curso_id)}")
        print(f"¿Son iguales? {tarea_curso_id == curso_id}")
        print(f"¿Son iguales como strings? {str(tarea_curso_id) == str(curso_id)}")
        
        if tarea.tema.unidad.curso_id != curso_id:
            # También puedes probar con strings para ver si ese es el problema
            if str(tarea.tema.unidad.curso_id) != str(curso_id):
                return Response(
                    {"error": f"La tarea no pertenece al curso especificado. Curso de la tarea: {tarea.tema.unidad.curso_id}, Curso proporcionado: {curso_id}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                # Si son iguales como strings pero no como sus tipos originales,
                # continúa con la ejecución pero ajusta el curso_id al formato correcto
                curso_id = tarea.tema.unidad.curso_id
        
        # Registrar la tarea como completada (si no lo estaba ya)
        tarea_completada, created = TareaCompletada.objects.get_or_create(
            inscripcion=inscripcion,
            tarea=tarea
        )
        
        # Actualizar el porcentaje
        inscripcion.actualizar_porcentaje()
        
        return Response({
            "message": "Tarea marcada como completada",
            "porcentaje_actual": inscripcion.porcentaje_completado
        })
        
    except Inscripcion.DoesNotExist:
        return Response(
            {"error": "El usuario no está inscrito en este curso"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Tarea.DoesNotExist:
        return Response(
            {"error": "La tarea no existe"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        print(f"Error no esperado: {str(e)}")
        return Response(
            {"error": f"Error inesperado: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def estado_tareas(request, curso_id):
    try:
        # Verificar que el usuario esté inscrito en el curso
        inscripcion = Inscripcion.objects.get(
            usuario=request.user,
            curso_id=curso_id
        )
        
        # Obtener las IDs de todas las tareas completadas por este usuario en este curso
        tareas_completadas_ids = set(
            str(tarea_id) for tarea_id in TareaCompletada.objects.filter(
                inscripcion=inscripcion
            ).values_list('tarea_id', flat=True)
        )
        
        print(f"Tareas completadas IDs: {tareas_completadas_ids}")  # Para debugging
        
        # Estructurar los datos por unidades y temas
        unidades = []
        for unidad in inscripcion.curso.unidades.all().order_by('orden'):
            temas_data = []
            for tema in unidad.temas.all().order_by('orden'):
                tareas_data = []
                for tarea in tema.tareas.all():
                    # Convertir tarea.id a string para comparación con IDs recuperados de la DB
                    tarea_id_str = str(tarea.id)
                    tareas_data.append({
                        'id': tarea_id_str,
                        'titulo': tarea.titulo,
                        'completada': tarea_id_str in tareas_completadas_ids
                    })
                
                temas_data.append({
                    'id': str(tema.id),
                    'nombre': tema.nombre,
                    'tareas': tareas_data
                })
            
            unidades.append({
                'id': str(unidad.id),
                'nombre': unidad.nombre,
                'orden': unidad.orden,
                'temas': temas_data
            })
        
        return Response({
            'unidades': unidades,
            'porcentaje_completado': inscripcion.porcentaje_completado
        })
        
    except Inscripcion.DoesNotExist:
        return Response(
            {"error": "El usuario no está inscrito en este curso"}, 
            status=status.HTTP_400_BAD_REQUEST
        )



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reiniciar_progreso(request, inscripcion_id):
    try:
        # Verificar que la inscripción pertenezca al usuario actual
        inscripcion = Inscripcion.objects.get(
            id=inscripcion_id,
            usuario=request.user
        )
        
        # Eliminar todas las tareas completadas asociadas a esta inscripción
        TareaCompletada.objects.filter(inscripcion=inscripcion).delete()
        
        # Reiniciar el porcentaje
        inscripcion.porcentaje_completado = 0
        inscripcion.save()
        
        return Response({
            "message": "Progreso reiniciado correctamente",
            "porcentaje_actual": inscripcion.porcentaje_completado
        })
        
    except Inscripcion.DoesNotExist:
        return Response(
            {"error": "Inscripción no encontrada o no pertenece al usuario actual"}, 
            status=status.HTTP_404_NOT_FOUND
        )