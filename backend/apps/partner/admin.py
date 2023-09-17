from django.contrib import admin
from django.contrib.auth.admin import UserAdmin


from .models import Partner, PartnerProfile


@admin.register(Partner)
class PartnerUserAdmin(UserAdmin):
    pass
    # list_display = ("id", "username", "email", "is_staff",'last_login','date_joined')
    # list_filter = ("is_staff",)
    # list_display_links = ("username", "email")
    readonly_fields = ("date_joined", "last_login")
    # filter_horizontal = ("groups", "user_permissions")
    # fieldsets = (
    #     ("Personal Info", {"fields": ("username", "email", "password",'avatar','first_name','last_name')}),
    #     ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
    #     ("Important dates", {"fields": ("last_login", "date_joined")}),
    # )
    # add_fieldsets = (
    #     (
    #         None,
    #         {
    #             "classes": ("wide",),
    #             "fields": (
    #                 "username",
    #                 "first_name",
    #                 'last_name',
    #                 'avatar',
    #                 "email",
    #                 "password1",
    #                 "password2",
    #                 "is_active",
    #                 "is_staff",
    #             ),
    #         },
    #     ),
    # )

