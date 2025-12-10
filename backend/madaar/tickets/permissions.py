from rest_framework import permissions

# Permission pour les admins seulement
class IsAdminUser(permissions.BasePermission):
    """
    Autorise seulement les utilisateurs avec is_staff = True (Admin)
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_staff

# Permission pour les tickets des utilisateurs
class IsOwnerOrAdmin(permissions.BasePermission):
    """
    L'utilisateur peut voir/éditer son ticket, l'admin peut tout voir
    """

    def has_object_permission(self, request, view, obj):
        # Admin peut tout faire
        if request.user.is_staff:
            return True
        # L'utilisateur peut seulement accéder à ses propres tickets
        return obj.created_by == request.user
