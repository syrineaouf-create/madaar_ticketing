import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'madaar.settings')
django.setup()

from django.contrib.auth.models import User
from django.conf import settings

def create_admin_from_env():
    if not settings.FIRST_ADMIN_PASSWORD:
        print("❌ Variable d'environnement ADMIN_PASSWORD non définie!")
        return
    
    if User.objects.filter(is_superuser=True).exists():
        print("✅ Admin existe déjà")
        return
    
    User.objects.create_superuser(
        username=settings.FIRST_ADMIN_USERNAME,
        email=settings.FIRST_ADMIN_EMAIL,
        password=settings.FIRST_ADMIN_PASSWORD
    )
    print(f"✅ Admin créé: {settings.FIRST_ADMIN_USERNAME}")

if __name__ == '__main__':
    create_admin_from_env()
