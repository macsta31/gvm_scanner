from django.urls import path

from . import views

urlpatterns = [
    path('authenticate', views.authenticate),
    path('logout', views.logout_view),
    path('signup', views.new_user),
    path('get', views.get_users)
]