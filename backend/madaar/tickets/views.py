from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Ticket
from .serializers import (
    TicketSerializer,
    TicketCreateSerializer,
    TicketStatusUpdateSerializer
)
from .permissions import IsAdminUser, IsOwnerOrAdmin
from django.http import JsonResponse

def home(request):
    return JsonResponse({"message": "Welcome to Madaar Ticketing API"})

class TicketViewSet(viewsets.ModelViewSet):
    # ✅ CES LIGNES RÉSOLVENT 500 ERROR + WARNINGS
    queryset = Ticket.objects.all().order_by('-created_at')
    serializer_class = TicketSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'status']
    search_fields = ['title', 'created_by__username']
    ordering_fields = ['created_at']

    permission_classes_by_action = {
        'create': [permissions.IsAuthenticated],
        'list': [permissions.IsAuthenticated],
        'retrieve': [IsOwnerOrAdmin],
        'update': [IsAdminUser],
        'partial_update': [IsAdminUser],
        'destroy': [IsAdminUser],
        'update_status': [IsAdminUser]
    }

    def get_permissions(self):
        try:
            permission_classes = self.permission_classes_by_action[self.action]
        except KeyError:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action == 'create':
            return TicketCreateSerializer
        elif self.action == 'partial_update':
            return TicketStatusUpdateSerializer
        return TicketSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Ticket.objects.all().prefetch_related('status_history')
        return Ticket.objects.filter(created_by=user).prefetch_related('status_history')

    def perform_create(self, serializer):
        """Auto-set created_by lors de la création"""
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Endpoint dédié pour changer le status (admin only)"""
        ticket = self.get_object()
        serializer = self.get_serializer(ticket, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(TicketSerializer(ticket).data, status=200)
