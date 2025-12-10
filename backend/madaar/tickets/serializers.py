from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Ticket, TicketStatusHistory

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

# TicketStatusHistory Serializer
class TicketStatusHistorySerializer(serializers.ModelSerializer):
    changed_by = UserSerializer(read_only=True)

    class Meta:
        model = TicketStatusHistory
        fields = ['id', 'status', 'changed_at', 'changed_by']

# Ticket Serializer
class TicketSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    status_history = TicketStatusHistorySerializer(many=True, read_only=True)
    attachment = serializers.CharField(source='attachment.url', read_only=True)

    class Meta:
        model = Ticket
        fields = ['id', 'title', 'description', 'category', 'status', 
                  'attachment', 'created_by', 'created_at', 'status_history']

# Ticket Creation Serializer
class TicketCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ['title', 'description', 'category', 'attachment']

    def create(self, validated_data):
        user = self.context['request'].user  # récupère l'utilisateur connecté
        ticket = Ticket.objects.create(created_by=user, **validated_data)
        # Créer automatiquement un historique initial
        TicketStatusHistory.objects.create(ticket=ticket, status=ticket.status, changed_by=user)
        return ticket

# Ticket Status Update Serializer (PATCH)
class TicketStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ['status']

    def update(self, instance, validated_data):
        user = self.context['request'].user
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        # Ajouter un historique de changement
        TicketStatusHistory.objects.create(ticket=instance, status=instance.status, changed_by=user)
        return instance
