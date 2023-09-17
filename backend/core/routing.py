from django.urls import re_path

from apps.camera.consumers import VideoFeedConsumer
from apps.camera.consumers import VideoFeedConsumer
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

websocket_urlpatterns = [
    re_path(r'ws/video_feed/$', VideoFeedConsumer.as_asgi()),
]


application = ProtocolTypeRouter({
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})