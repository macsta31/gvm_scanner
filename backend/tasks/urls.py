

from django.urls import path

from . import views

urlpatterns = [
    path('create', views.create_task),
    path('get', views.get_tasks),
    path('delete', views.delete_task),
    path('start', views.start_task),
    path('stop/', views.stop_task),
    path('status', views.task_status),
    path('get_id', views.get_task),
    path('socket/', views.random),
    
]