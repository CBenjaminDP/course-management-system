import json
from django.shortcuts import render
from django.http import JsonResponse
from .models import Curso
from .forms import CursoForm
from django.shortcuts import render, redirect, get_object_or_404

#Metodo que devuelve el JSON
def listar_cursos(request):
    #Obtener todas la instancias del objeto de la BD
    cursos = Curso.objects.all()
    #Crear una variable en formato de diccionario por que le JSONResponse necesita un diccionario
    data = [
        {
            'id': curso.id,
            'nombre': curso.nombre,
            'descripcion': curso.descripcion,
            'profesor': curso.profesor,
            'fecha_inicio': curso.fecha_inicio,
            'fecha_fin': curso.fecha_fin,
            'estado': curso.estado
        } 
        for curso in cursos
    ]
    return JsonResponse(data, safe=False)

#Funcion que registre sin recargar la pagina osea sin hacer render 
def registrar_curso(request):
    #checar que estemos manejando un metodo POST
    if request.method == 'POST':
        #aqui se puede validar si hay sesion antes de hacer el registro
        try:
            #Obtener los datos del cuerpo de la peticion
            data = json.loads(request.body)
            #Crear una instancia del modelo Curso
            curso = Curso.objects.create(
                nombre=data['nombre'],
                descripcion=data['descripcion'],
                profesor=data['profesor'],
                fecha_inicio=data['fecha_inicio'],
                fecha_fin=data['fecha_fin'],
                estado=data['estado']
            )
            #Retornar un JSON con un mensaje de exito y el id del curso creado
            return JsonResponse({'mensaje': 'Curso creado correctamente', 'id': curso.id}, status=201)
        #Si hay un error
        except Exception as e:
            #Retornar un JSON con un mensaje de error
            return JsonResponse({'error': str(e)}, status=400)
    #Si el metodo no es POST
    return JsonResponse({'error': 'Método no permitido'}, status=405)


#Funcion que actualiza un curso
def actualizar_curso(request, id):
    #Si el metodo es PUT
    if request.method == 'PUT':
        #Obtener el curso a actualizar
        curso = get_object_or_404(Curso, id=id)
        try:
            #Obtener los datos del cuerpo de la peticion
            data = json.loads(request.body)
            #Actualizar los campos del curso
            curso.nombre = data['nombre']
            curso.descripcion = data['descripcion']
            curso.profesor = data['profesor']
            curso.fecha_inicio = data['fecha_inicio']
            curso.fecha_fin = data['fecha_fin']
            curso.estado = data['estado']
            #Guardar los cambios en la BD
            curso.save()
            #Retornar un JSON con un mensaje de exito
            return JsonResponse({'mensaje': 'Curso actualizado correctamente'}, status=200)
        #Si hay un error
        except Exception as e:
            #Retornar un JSON con un mensaje de error
            return JsonResponse({'error': str(e)}, status=400)
    #Si el metodo
    return JsonResponse({'error': 'Método no permitido'}, status=405)   


#Funcion que elimina un curso
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


#Funcion que obtiene un curso
def obtener_curso(request, id):
    #Si el metodo es GET
    if request.method == 'GET':
        #Obtener el curso
        curso = get_object_or_404(Curso, id=id)
        try:
            #Crear un diccionario con los datos del curso
            data = {
                'id': curso.id,
                'nombre': curso.nombre,
                'descripcion': curso.descripcion,
                'profesor': curso.profesor,
                'fecha_inicio': curso.fecha_inicio,
                'fecha_fin': curso.fecha_fin,
                'estado': curso.estado
            }
            #Retornar un JSON con los datos del curso
            return JsonResponse(data, status=200)
        #Si hay un error
        except Exception as e:
            #Retornar un JSON con un mensaje de error
            return JsonResponse({'error': str(e)}, status=400)
    #Si el metodo no es GET
    return JsonResponse({'error': 'Método no permitido'}, status=405)

