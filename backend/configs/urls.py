from django.urls import path

from . import views

urlpatterns = [
    path('get', views.get_configs),
    path('create', views.create_config),
    path('modify', views.modify_config),
    path('filters', views.get_filters),
    path('create_filter', views.create_filter),
    path('get_id', views.get_config)
]