from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    home,
    register,
    UserRegistrationView,
    FirstAdminSetupView,
    CurrentUserView,
    TicketViewSet
)

router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='ticket')

urlpatterns = [
    path('', home, name='home'),
    path('register/', register, name='register'),
    path('auth/register/', UserRegistrationView.as_view(), name='user-register'),
    path('auth/setup-admin/', FirstAdminSetupView.as_view(), name='setup-admin'),
    path('auth/me/', CurrentUserView.as_view(), name='current-user'),
    path('', include(router.urls)),
]
