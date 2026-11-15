from rest_framework import permissions


class IsOwnUserOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj.id == request.user.id
