import os
import django

# Configure Django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "madaar.settings")
django.setup()

from django.contrib.auth.models import User
from django.conf import settings


def create_admin_from_env():
    # Check required password setting
    if not settings.FIRST_ADMIN_PASSWORD:
        print("Environment variable FIRST_ADMIN_PASSWORD is not set!")
        return

    # Do not create a new admin if one already exists
    if User.objects.filter(is_superuser=True).exists():
        print("A super admin already exists.")
        return

    # Create the superuser using values from settings
    User.objects.create_superuser(
        username=settings.FIRST_ADMIN_USERNAME,
        email=settings.FIRST_ADMIN_EMAIL,
        password=settings.FIRST_ADMIN_PASSWORD,
    )
    print(f"Admin created: {settings.FIRST_ADMIN_USERNAME}")


if __name__ == "__main__":
    create_admin_from_env()
