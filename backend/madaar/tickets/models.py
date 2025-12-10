from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField

class Ticket(models.Model):
  

    CATEGORY_CHOICES = [ 
        ('Technical', 'Technical'),
        ('Financial', 'Financial'),
        ('Product', 'Product'),
    ]
    STATUS_CHOICES = [
        ('New', 'New'),
        ('Under Review', 'Under Review'),
        ('Resolved', 'Resolved'),
    ]

      
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='New')
    attachment = CloudinaryField('file', blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
#model to save the history
class TicketStatusHistory(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='status_history')
    status = models.CharField(max_length=50, choices=Ticket.STATUS_CHOICES)
    changed_at = models.DateTimeField(auto_now_add=True)
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.ticket.title} → {self.status} at {self.changed_at}"