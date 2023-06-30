from django.urls import path

from . import views

urlpatterns = [
    path('get', views.get_reports),
    path('get_id', views.get_report),
    path('get_formats', views.get_report_formats)
]