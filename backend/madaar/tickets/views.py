from django.http import JsonResponse
from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User

from .models import Ticket, TicketStatusHistory
from .serializers import (
    TicketSerializer,
    TicketCreateSerializer,
    TicketStatusUpdateSerializer,
)
from .permissions import IsAdminUser, IsOwnerOrAdmin
from .user_serializers import (
    UserRegistrationSerializer, 
    UserSerializer,
    AdminRegistrationSerializer
)


def home(request):
    return JsonResponse({"message": "Welcome to Madaar Ticketing API"})


class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            "user": UserSerializer(user).data,
            "message": "User created successfully. You can now log in."
        }, status=status.HTTP_201_CREATED)


class FirstAdminSetupView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        # Check if an admin already exists
        if User.objects.filter(is_superuser=True).exists():
            return Response(
                {"error": "An administrator already exists. This page is disabled."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Create the first admin
        validated_data = serializer.validated_data
        admin_user = User.objects.create_superuser(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        
        return Response({
            "user": UserSerializer(admin_user).data,
            "message": "First administrator created successfully! You can now log in."
        }, status=status.HTTP_201_CREATED)


class AdminRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = AdminRegistrationSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def create(self, request, *args, **kwargs):
        # Additional verification
        if not request.user.is_superuser:
            return Response(
                {"error": "Only super administrators can create admins."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        admin_user = serializer.save()
        
        return Response({
            "user": UserSerializer(admin_user).data,
            "message": "Administrator created successfully."
        }, status=status.HTTP_201_CREATED)


class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by('-created_at')
    serializer_class = TicketSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'status']
    search_fields = ['title', 'created_by__username']
    ordering_fields = ['created_at']

    permission_classes = [IsAuthenticated]

    permission_classes_by_action = {
        'create': [permissions.IsAuthenticated],
        'list': [permissions.IsAuthenticated],
        'retrieve': [IsOwnerOrAdmin],
        'update': [IsOwnerOrAdmin],
        'partial_update': [IsOwnerOrAdmin],
        'destroy': [IsAdminUser],
        'update_status': [IsAdminUser],
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
        elif self.action in ['partial_update', 'update_status']:
            return TicketStatusUpdateSerializer
        return TicketSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Ticket.objects.all().prefetch_related('status_history')
        return Ticket.objects.filter(
            created_by=user
        ).prefetch_related('status_history')

    def perform_create(self, serializer):
        """Auto-set created_by on creation"""
        ticket = serializer.save()
        # Create initial history
        TicketStatusHistory.objects.create(
            ticket=ticket,
            status=ticket.status,
            changed_by=self.request.user
        )

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Dedicated endpoint to change status (admin only)"""
        user = request.user
        if not user.is_staff:
            raise PermissionDenied("You do not have permission to modify the status.")

        ticket = self.get_object()
        serializer = self.get_serializer(ticket, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(TicketSerializer(ticket).data, status=200)
