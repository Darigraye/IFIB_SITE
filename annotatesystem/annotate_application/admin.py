from django import forms
from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.core.exceptions import ValidationError

from .models import *


class UserCreationForm(forms.ModelForm):
    """A form for creating new users. Includes all the required
    fields, plus a repeated password."""

    password1 = forms.CharField(label="Password", widget=forms.PasswordInput)
    password2 = forms.CharField(
        label="Password confirmation", widget=forms.PasswordInput
    )

    class Meta:
        model = MEPHIUser
        fields = ["username", "email", "phone_number", "first_name", "last_name", "patronymic"]

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    disabled password hash display field.
    """

    password = ReadOnlyPasswordHashField()

    class Meta:
        model = MEPHIUser
        fields = ["username", "email", "phone_number", "first_name", "last_name", "patronymic", "password", "is_active", "is_admin"]


class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ["username", "email", "phone_number", "first_name", "last_name", "patronymic", "is_admin"]
    list_filter = ["is_admin"]
    fieldsets = [
        (None, {"fields": ["username", "email", "password"]}),
        ("Personal info", {"fields": ["phone_number", "first_name", "last_name", "patronymic"]}),
        ("Permissions", {"fields": ["is_admin"]}),
    ]
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = [
        (
            None,
            {
                "classes": ["wide"],
                "fields": ["username", "email", "phone_number", "first_name", "last_name", "patronymic", "password1", "password2"],
            },
        ),
    ]
    search_fields = ["email"]
    ordering = ["email"]
    filter_horizontal = []


admin.site.register(MEPHIUser, UserAdmin)
admin.site.unregister(Group)

admin.site.register(MEPHIUserCategory)
admin.site.register(Patient)
admin.site.register(Marker)
admin.site.register(Marking)
admin.site.register(Terms)
admin.site.register(DictCellsCharacteristics)
admin.site.register(ResearchedObject)
admin.site.register(ResearchResult)
admin.site.register(PatientResearch)
admin.site.register(Medication)
admin.site.register(Immunophenotyping)
admin.site.register(CellImage)
admin.site.register(SystemSettings)
admin.site.register(CellMarking)
admin.site.register(Cell)
admin.site.register(CellCharacteristic)
admin.site.register(MorphologicalResearch)
admin.site.register(SystemLog)
admin.site.register(SystemParameters)
