from django import forms
from .models import Tema

class TemaForm(forms.ModelForm):
    class Meta:
        model = Tema
        fields = ['nombre', 'unidad', 'descripcion', 'orden']
        widgets = {
            'nombre': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Nombre del tema'}),
            'unidad': forms.Select(attrs={'class': 'form-control'}),
            'descripcion': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Descripción del tema', 'rows': 4}),
            'orden': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Orden del tema'}),
        }

        labels = {
            'nombre': 'Nombre del tema',
            'unidad': 'Unidad',
            'descripcion': 'Descripción',
            'orden': 'Orden',
        }

        help_texts = {
            'nombre': 'Ingrese el nombre del tema',
            'unidad': 'Seleccione la unidad a la que pertenece el tema',
            'descripcion': 'Ingrese una descripción del tema',
            'orden': 'Ingrese el orden del tema',
        }

        error_messages = {
            'nombre': {
                'required': 'Este campo es obligatorio',
            },
            'unidad': {
                'required': 'Este campo es obligatorio',
            },
            'orden': {
                'required': 'Este campo es obligatorio',
            },
        }
