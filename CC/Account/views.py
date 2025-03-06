from django.shortcuts import render, redirect
from django.contrib.auth import views, get_user_model
from django.contrib.auth import login
from django.http import HttpResponseRedirect
from . import forms
from .models import AdvancedUser



def page_not_found_view(request, exception):
    return render(request, 'page_not_found.html', status=404)



def register(request):
    if request.user.is_authenticated:
        return redirect('profile')
    else:
        if request.method == 'POST':
            form = forms.RegistrationForm(request.POST)
            if form.is_valid():
                data = form.cleaned_data
                user = get_user_model().objects.create(
                    username=data['username'],
                    email=data['email'],
                    password=data['password1']
                )
                AdvancedUser.objects.create(user=user)
                login(request, user)
                return redirect('profile')
        else:
            form = forms.RegistrationForm()

        return render(request, 'account/registration.html', {'form': form})



class LoginUser(views.LoginView):
    template_name = 'account/login.html'
    form_class = forms.LoginForm

    def dispatch(self, request, *args, **kwargs):
        if self.redirect_authenticated_user and self.request.user.is_authenticated:
            redirect_to = self.get_success_url()
            if redirect_to == self.request.path:
                raise ValueError(
                    "Redirection loop for authenticated user detected. Check that "
                    "your LOGIN_REDIRECT_URL doesn't point to a login page."
                )
            return HttpResponseRedirect(redirect_to)
        if request.user.is_authenticated:
            return redirect('profile')
        else:
            return super().dispatch(request, *args, **kwargs)



class PasswordChange(views.PasswordChangeView):
    def dispatch(self, *args, **kwargs):
        if self.request.user.is_authenticated:
            return super().dispatch(*args, **kwargs)
        else:
            return redirect('login')
    template_name = 'account/password_change.html'
    form_class = forms.ChangePasswordForm



class PasswordChangeDone(views.PasswordChangeDoneView):
    def dispatch(self, *args, **kwargs):
        if self.request.user.is_authenticated:
            return super().dispatch(*args, **kwargs)
        else:
            return redirect('login')
    template_name = 'account/password_change_done.html'