from django.contrib.auth.hashers import make_password

passwords = {
    'admin': 'admin123',
    'teacher': 'teacher123',
    'student': 'student123'
}

for user, password in passwords.items():
    hashed = make_password(password)
    print(f"User: {user}")
    print(f"Hashed password: {hashed}\n")