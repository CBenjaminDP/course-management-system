from django import forms
from .models import Usuario

class UsuarioForm(forms.ModelForm):
    class Meta:
        model = Usuario
        fields = ['username', 'password', 'nombre_completo', 'email', 'rol']

        widgets = {
            'username': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ingrese su nombre de usuario'}),
            'password': forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Ingrese su contraseña'}),
            'nombre_completo': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ingrese su nombre completo'}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Ingrese su correo electrónico'}),
            'rol': forms.Select(attrs={'class': 'form-control'}),  # Eliminado placeholder en Select
        }

        labels = {
            'username': 'Nombre de usuario',
            'password': 'Contraseña',
            'nombre_completo': 'Nombre completo',
            'email': 'Correo electrónico',
            'rol': 'Rol',
        }

        error_messages = {
            'username': {
                'required': 'Este campo es requerido',
                'unique': 'Este nombre de usuario ya existe'
            },
            'password': {
                'required': 'Este campo es requerido'
            },
            'nombre_completo': {
                'required': 'Este campo es requerido'
            },
            'email': {
                'required': 'Este campo es requerido',
                'unique': 'Este correo electrónico ya existe'
            },
            'rol': {
                'required': 'Este campo es requerido'
            }
        }
