from django.urls import path
from django.contrib.auth.views import (LogoutView,
                                       PasswordResetView,
                                       PasswordResetDoneView,
                                       PasswordResetConfirmView,
                                       PasswordResetCompleteView)
from django.contrib.auth.decorators import login_required
from django.urls import reverse_lazy
from . import views, forms

urlpatterns = [
    path('registration/', views.register, name='registration'),
    path('login/', views.LoginUser.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),


    path('password_change/', login_required(views.PasswordChange.as_view()), name='password_change'),
    path('password_change/done/', login_required(views.PasswordChangeDone.as_view()), name='password_change_done'),


    path(
        'password_reset/',
         PasswordResetView.as_view(template_name='account/password_reset.html',
                                   form_class=forms.PassResetForm,
                                   email_template_name='account/password_reset_email.html',
                                   success_url=reverse_lazy('password_reset_done')),
         name='password_reset'
    ),
    path(
        'password_reset/done',
         PasswordResetDoneView.as_view(template_name='account/password_reset_done.html'),
         name='password_reset_done'
    ),
    path(
        'password_reset/<uidb64>/<token>',
        PasswordResetConfirmView.as_view(template_name='account/password_reset_confirm.html',
                                         form_class=forms.PassResetConfirmForm,
                                         success_url=reverse_lazy('password_reset_complete')),
        name='password_reset_confirm'
         ),
    path(
        'password_reset/complete',
        PasswordResetCompleteView.as_view(template_name='account/password_reset_complete.html'),
        name='password_reset_complete'
    )
]