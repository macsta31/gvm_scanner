import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.sessions import SessionMiddlewareStack
import tasks.routing  # Import the routing file of your app

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gvmapp.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": SessionMiddlewareStack(
        URLRouter(
            tasks.routing.websocket_urlpatterns
        )
    ),
})