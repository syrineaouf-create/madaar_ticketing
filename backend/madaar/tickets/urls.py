from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, UserRegistrationView, CurrentUserView, FirstAdminSetupView, AdminRegistrationView

router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='ticket')

urlpatterns = [
    path('', include(router.urls)),
    path('setup/', FirstAdminSetupView.as_view(), name='first-setup'),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('register-admin/', AdminRegistrationView.as_view(), name='register-admin'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
]