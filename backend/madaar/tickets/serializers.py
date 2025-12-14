from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Ticket, TicketStatusHistory
User = get_user_model()
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class TicketStatusHistorySerializer(serializers.ModelSerializer):
    changed_by = UserSerializer(read_only=True)
    class Meta:
        model = TicketStatusHistory
        fields = ['id', 'status', 'changed_at', 'changed_by']

class TicketSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    status_history = TicketStatusHistorySerializer(many=True, read_only=True)
    attachment = serializers.CharField(source='attachment.url', read_only=True)
    
    class Meta:
        model = Ticket
        fields = ['id', 'title', 'description', 'category', 'status', 
                 'attachment', 'created_by', 'created_at', 'status_history']

class TicketCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ['title', 'description', 'category', 'attachment']
    
    def create(self, validated_data):
        # created_by sera passé par perform_create dans la view
        return Ticket.objects.create(**validated_data)

        TicketStatusHistory.objects.create(
            ticket=ticket, 
            status=ticket.status, 
            changed_by=user
        )
        return ticket

class TicketStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ['status']
    
    def update(self, instance, validated_data):
        user = self.context['request'].user
        old_status = instance.status
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        
        if old_status != instance.status:
            TicketStatusHistory.objects.create(
                ticket=instance, 
                status=instance.status, 
                changed_by=user
            )
        return instance
