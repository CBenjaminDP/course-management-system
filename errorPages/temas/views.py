import json
from django.shortcuts import render
from django.http import JsonResponse
from .models import Tema
from .forms import TemaForm
from django.shortcuts import redirect
from django.shortcuts import get_object_or_404

#Metodo que devuelve el JSON
def listar_temas(request):
    #Obtener todas la instancias del objeto de la BD
    temas = Tema.objects.all()
    #Crear una variable en formato de diccionario por que le JSONResponse necesita un diccionario

    data = [
        {
            'id': tema.id,
            'nombre': tema.nombre,
            'unidad': tema.unidad.nombre,
            'descripcion': tema.descripcion,
            'orden': tema.orden,
        } for tema in temas
    ]
    #Retornar la respuesta en formato JSON
    return JsonResponse(data, safe=False)



#Funcion que registre sin recaragar la pagina osea sin hacer render 
def registrar_tema(request):
    #Si el metodo es POST
    if request.method == 'POST':
        #aqui se puede validar si hay sesion antes de hacer el registro
        try: 
            #intentar obtener los datos del body request 
            data = json.loads(request.body)
            #Crear una instancia del modelo 
            tema = Tema.objects.create(
                #basicamente es un constructor de objetos
                nombre=data['nombre'],
                unidad_id=data['unidad'],
                descripcion=data['descripcion'],
                orden=data['orden'],
            )#la funcion create directamente guarda el objeto en la BD
            #Retornar un JSON
            return JsonResponse({'mensaje': 'Tema registrado correctamente', 'id':tema.id}, status=201)
        except:
            #Si hay un error retornar un JSON
            return JsonResponse({'mensaje': 'Error al registrar el tema'}, status=400)
        #Si el metodo no es POST retornar un JSON
    return JsonResponse({'mensaje': 'Método no permitido'}, status=405)


#Funcion que actualiza sin recargar la pagina
def actualizar_tema(request, id):
     
    if request.method == 'PUT':
     #Intentar actualizar el objeto
     #1) Obtener la entidad a actualizar
     #Parametros: modelo y id o identificador del objeto
       tema = get_object_or_404(Tema, id=id)

       try:
           #2) Obtener los datos del body request
           data = json.loads(request.body)
           #3) Actualizar los campos del objeto
           tema.nombre = data['nombre']
           tema.unidad = data['unidad']
           tema.descripcion = data['descripcion']
           tema.orden = data['orden']
           #4) Guardar los cambios
           tema.save()
           #5) Retornar un JSON
           return JsonResponse({'mensaje': 'Tema actualizado correctamente'}, status=200)
       except Exception as e:
              #Si hay un error retornar un JSON
            return JsonResponse({'mensaje': 'Error al actualizar el tema'}, status=400)
    return JsonResponse({'mensaje': 'Método no permitido'}, status=405)


#Funcion que elimina sin recargar la pagina
def eliminar_tema(request, id):
    if request.method == 'DELETE':
        #Intentar eliminar el objeto
        #1) Obtener la entidad a eliminar
        #Parametros: modelo y id o identificador del objeto
        tema = get_object_or_404(Tema, id=id)
        try:
            #Eliminar la entidad
            tema.delete()
            #Retornar un JSON
            return JsonResponse({'mensaje': 'Tema eliminado correctamente'}, status=200)
        except Exception as e:
            #Si hay un error retornar un JSON
            return JsonResponse({'mensaje': 'Error al eliminar el tema'}, status=400)
    return JsonResponse({'mensaje': 'Método no permitido'}, status=405)
         

#Funcion que obtiene un objeto por su id
def obtener_tema(request, id):
   if request.method == 'GET':
        #Intentar obtener el objeto
        #1) Obtener la entidad a obtener
        #Parametros: modelo y id o identificador del objeto
        tema = get_object_or_404(Tema, id=id)
        try:
            #Crear un diccionario con los datos del objeto
            data = {
                'id': tema.id,
                'nombre': tema.nombre,
                'unidad': tema.unidad.id,
                'descripcion': tema.descripcion,
                'orden': tema.orden,
            }
            #Retornar un JSON
            return JsonResponse(data, status=200)
        except Exception as e:
            #Si hay un error retornar un JSON
            return JsonResponse({'mensaje': 'Error al obtener el tema'}, status=400)
   return JsonResponse({'mensaje': 'Método no permitido'}, status=405)
   

            