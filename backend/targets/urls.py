from django.urls import path

from . import views

urlpatterns = [
    path('create', views.create_target),
    path('delete', views.delete_target),
    path('get', views.get_targets),
    path('get_id', views.get_target)
]