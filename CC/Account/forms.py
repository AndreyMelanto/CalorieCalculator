from django import forms
from django.contrib.auth.forms import (PasswordChangeForm,
                                       AuthenticationForm,
                                       UserCreationForm,
                                       PasswordResetForm,
                                       SetPasswordForm)
from django.contrib.auth import get_user_model



class LoginForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={
        "autofocus": True,
        'class': 'third_color input_border',
        'placeholder': 'Имя пользователя'
    }))
    password = forms.CharField(widget=forms.PasswordInput(attrs={
        "autocomplete": "current-password",
        'class': 'third_color input_border',
        'placeholder': 'Пароль',
        'onfocus': 'password_view(this)',
        'onfocusout': 'password_hide(this)'
    }))



class RegistrationForm(UserCreationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={
        "autofocus": True,
        'class': 'third_color input_border',
        'placeholder': 'Имя пользователя'
    }))
    email = forms.EmailField(widget=forms.EmailInput(attrs={
        'class': 'third_color input_border',
        'placeholder': 'E-mail'
    }))
    password1 = forms.CharField(widget=forms.PasswordInput(attrs={
        "autocomplete": "current-password",
        'class': 'third_color input_border',
        'placeholder': 'Пароль',
        'onfocus': 'password_view(this)',
        'onfocusout': 'password_hide(this)'
    }))
    password2 = forms.CharField(widget=forms.PasswordInput(attrs={
        "autocomplete": "current-password",
        'class': 'third_color input_border',
        'placeholder': 'Повторите пароль',
        'onfocus': 'password_view(this)',
        'onfocusout': 'password_hide(this)'
    }))

    class Meta:
        model = get_user_model()
        fields = ['username', 'email', 'password1', 'password2']
        labels = {'email': 'E-mail'}

    def clean_email(self):
        email = self.cleaned_data['email']
        if get_user_model().objects.filter(email=email).exists():
            raise forms.ValidationError('E-mail занят')
        return email



class ChangePasswordForm(PasswordChangeForm):
    old_password = forms.CharField(widget=forms.PasswordInput(attrs={
        "autocomplete": "current-password",
        'class': 'third_color input_border',
        'placeholder': 'Старый пароль',
        'onfocus': 'password_view(this)',
        'onfocusout': 'password_hide(this)'
    }))
    new_password1 = forms.CharField(widget=forms.PasswordInput(attrs={
        "autocomplete": "current-password",
        'class': 'third_color input_border',
        'placeholder': 'Новый пароль',
        'onfocus': 'password_view(this)',
        'onfocusout': 'password_hide(this)'
    }))
    new_password2 = forms.CharField(widget=forms.PasswordInput(attrs={
        "autocomplete": "current-password",
        'class': 'third_color input_border',
        'placeholder': 'Повторите новый пароль',
        'onfocus': 'password_view(this)',
        'onfocusout': 'password_hide(this)'
    }))



class PassResetForm(PasswordResetForm):
    email = forms.EmailField(
        max_length=254,
        widget=forms.EmailInput(attrs={"autocomplete": "email", 'placeholder': 'E-mail', 'class': 'third_color input_border'}),
    )



class PassResetConfirmForm(SetPasswordForm):
    new_password1 = forms.CharField(widget=forms.PasswordInput(attrs={
        "autocomplete": "current-password",
        'class': 'third_color input_border',
        'placeholder': 'Новый пароль',
        'onfocus': 'password_view(this)',
        'onfocusout': 'password_hide(this)'
    }))
    new_password2 = forms.CharField(widget=forms.PasswordInput(attrs={
        "autocomplete": "current-password",
        'class': 'third_color input_border',
        'placeholder': 'Повторите новый пароль',
        'onfocus': 'password_view(this)',
        'onfocusout': 'password_hide(this)'
    }))