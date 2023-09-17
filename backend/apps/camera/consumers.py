from channels.generic.websocket import AsyncWebsocketConsumer
import json

class VideoFeedConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def video_stream(self, event):
        await self.send(text_data=json.dumps(event))
