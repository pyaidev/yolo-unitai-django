from django.urls import path, re_path
from apps.camera.views import ModelListView, ModelRetrieveUpdateDestroyView, CameraListView, CameraCreateView, CameraDetailView, CameraDetailView, video_feed,index
from .consumers import VideoFeedConsumer
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

urlpatterns = [
    path("model/", ModelListView.as_view()),
    path("model/<int:pk>/", ModelRetrieveUpdateDestroyView.as_view()),
    path("list/", CameraListView.as_view()),
    path("create/", CameraCreateView.as_view()),
    path("<int:pk>/", CameraDetailView.as_view()),
    path("update/<int:pk>/", CameraDetailView.as_view()),
    path('video_feed/<int:pk>/', video_feed, name='video_feed'),
    # path('video_feeed/', video_streamm, name='video_stream'),
    path('', index, name='index'),
]

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