from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import AdminPasswordChangeForm
from django.contrib import messages
from django.http import HttpResponseRedirect
from django.urls import path, reverse
from django.shortcuts import get_object_or_404, render
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display  = ['email', 'username', 'account_type', 'is_verified', 'is_active', 'is_staff']
    list_filter   = ['account_type', 'is_verified', 'is_staff', 'is_active']
    search_fields = ['email', 'username', 'company_name']
    ordering      = ['-date_joined']

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('account_type', 'phone', 'avatar', 'is_verified', 'company_name', 'tax_id')
        }),
    )

    # ── Custom URLs for set-password ────────────────────────────────────────
    def get_urls(self):
        urls = super().get_urls()
        custom = [
            path(
                '<id>/set-password/',
                self.admin_site.admin_view(self.set_password_view),
                name='accounts_user_set_password',
            ),
        ]
        return custom + urls

    def set_password_view(self, request, id):
        """Admin can set any user's password without knowing the old one."""
        user = get_object_or_404(User, pk=id)
        if request.method == 'POST':
            form = AdminPasswordChangeForm(user, request.POST)
            if form.is_valid():
                form.save()
                messages.success(request, f'Password for {user.email} changed successfully.')
                return HttpResponseRedirect(
                    reverse('admin:accounts_user_change', args=[id])
                )
        else:
            form = AdminPasswordChangeForm(user)

        context = {
            **self.admin_site.each_context(request),
            'title': f'Set password: {user.email}',
            'form': form,
            'user': user,
            'opts': self.model._meta,
        }
        return render(request, 'admin/auth/user/change_password.html', context)

    # ── Add Set Password link to change page ────────────────────────────────
    def change_view(self, request, object_id, form_url='', extra_context=None):
        extra_context = extra_context or {}
        extra_context['set_password_url'] = reverse(
            'admin:accounts_user_set_password', args=[object_id]
        )
        return super().change_view(request, object_id, form_url, extra_context)

    # ── Safe single-object delete ────────────────────────────────────────────
    def delete_model(self, request, obj):
        try:
            email = obj.email

            # 1. Clean up C2C listings + their products
            for product in obj.products.all():
                try:
                    if hasattr(product, 'c2c_listing'):
                        product.c2c_listing.delete()
                except Exception:
                    pass
                product.delete()

            # 2. Clean up B2B
            if hasattr(obj, 'rfqs'):
                obj.rfqs.all().delete()
            if hasattr(obj, 'b2b_orders'):
                obj.b2b_orders.all().delete()

            # 3. Clean up orders
            if hasattr(obj, 'orders'):
                obj.orders.all().delete()

            # 4. Delete the user
            obj.delete()
            messages.success(request, f'User {email} deleted successfully.')

        except Exception as e:
            messages.error(
                request,
                f'Could not delete user: {e}. '
                f'Try deactivating the account instead (uncheck Active).'
            )

    # ── Safe bulk delete ─────────────────────────────────────────────────────
    def delete_queryset(self, request, queryset):
        for user in queryset:
            self.delete_model(request, user)