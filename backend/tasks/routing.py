from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path('tasks/socket/', consumers.PracticeConsumer.as_asgi()),
]
