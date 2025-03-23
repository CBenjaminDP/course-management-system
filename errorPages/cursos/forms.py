from django import forms
from .models import Curso

class CursoForm(forms.ModelForm):
    #Definir los metadatos de la clase
    class Meta:
        #Definir el modelo al que pertenece el formulario
        model = Curso
        #Definir los campos del modelo que se van a mostrar en el formulario
        fields = ['nombre', 'descripcion', 'profesor', 'fecha_inicio', 'fecha_fin', 'estado']
        #Definir los atributos de los campos del formulario
        widgets = {
            'nombre': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Nombre del curso'}),
            'descripcion': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Descripción del curso'}),
            'profesor': forms.Select(attrs={'class': 'form-control'}),
            'fecha_inicio': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'fecha_fin': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'estado': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }

        #Personalizar las etiquetas o los textos que salen a lado de los inputs del formulario
        labels = {
            'nombre': 'Nombre',
            'descripcion': 'Descripción',
            'profesor': 'Profesor',
            'fecha_inicio': 'Fecha de inicio',
            'fecha_fin': 'Fecha de fin',
            'estado': 'Estado',
        }

        #Personalizar los mensajes de error de los campos del formulario
        error_messages = {
            'nombre': {
                'required': 'Este campo es requerido',
                'unique': 'Este nombre de curso ya existe'
            },
            'descripcion': {
                'required': 'Este campo es requerido'
            },
            'profesor': {
                'required': 'Este campo es requerido'
            },
            'fecha_inicio': {
                'required': 'Este campo es requerido'
            },
            'fecha_fin': {
                'required': 'Este campo es requerido'
            },
            'estado': {
                'required': 'Este campo es requerido'
            }
        }


