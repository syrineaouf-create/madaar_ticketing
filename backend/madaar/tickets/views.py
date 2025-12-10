from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Ticket
from .serializers import (
    TicketSerializer,
    TicketCreateSerializer,
    TicketStatusUpdateSerializer
)
from .permissions import IsAdminUser, IsOwnerOrAdmin
from django.http import JsonResponse
def home(request):
    return JsonResponse({"message":"Welcome to maddar ticketing Api"})
# Ticket ViewSet

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()

    # Choisir le serializer selon l'action
    def get_serializer_class(self):
        if self.action == 'create':
            return TicketCreateSerializer
        elif self.action == 'partial_update':
            return TicketStatusUpdateSerializer
        return TicketSerializer

    # Appliquer les permissions selon l'action
    def get_permissions(self):
        if self.action in ['partial_update']:  # Mise à jour du statut
            permission_classes = [IsAdminUser]
        elif self.action in ['retrieve', 'update', 'destroy']:  # Lecture/modif d'un ticket
            permission_classes = [IsOwnerOrAdmin]
        else:  # list, create
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    # Optionnel : filtrer la liste pour que l'utilisateur normal ne voie que ses tickets
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Ticket.objects.all()
        return Ticket.objects.filter(created_by=user)
