import cv2
import time
import requests
import numpy as np
from collections import defaultdict
from django.http import StreamingHttpResponse
from django.views.decorators import gzip
from django.shortcuts import render
from ultralytics import YOLO
from rest_framework import generics, status, views, permissions
from rest_framework.response import Response
from .serializers import ModelSerializer, CameraSerializer
from .models import Model, Camera
from django.shortcuts import get_object_or_404
from .permissions import IsOwnUserOrReadOnly
from rest_framework.permissions import IsAuthenticated



class ModelListView(generics.ListAPIView):
    queryset = Model.objects.all()
    serializer_class = ModelSerializer
    permissions_classes = (permissions.IsAuthenticated,)



class ModelRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Model.objects.all()
    serializer_class = ModelSerializer

    # permisson  is_admin
    permission_classes = [permissions.IsAdminUser]





class CameraListView(generics.ListAPIView):
    queryset = Camera.objects.all()
    serializer_class = CameraSerializer
    permissions_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return Camera.objects.filter(user=user)






class CameraCreateView(generics.CreateAPIView):
    queryset = Camera.objects.all()
    serializer_class = CameraSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)




class CameraDetailView(generics.DestroyAPIView):
    queryset = Camera.objects.all()
    serializer_class = CameraSerializer
    # permissions_classes = (permissions.IsAuthenticated,)

class CameraDetailView(generics.UpdateAPIView):
    queryset = Camera.objects.all()
    serializer_class = CameraSerializer



def video_feed(request, pk):
    camera = get_object_or_404(Camera, pk=pk)
    response = StreamingHttpResponse(video_stream(camera), content_type="multipart/x-mixed-replace;boundary=frame")
    print(response)
    return response


def index(request):
    return render(request, 'index.html')


##############Здесь вспомогательные функции##########################
#TODO: Нужно подумать, может эти функции вынести в отдельный класс или в отдельный файл, чтобы не загромождать код???

def send_tg_msg(token: str, chat_id: str, message: str):
    method = "sendMessage"
    url = f"https://api.telegram.org/bot{token}/{method}?chat_id={chat_id}&text={message}"
    requests.post(url)

def send_tg_img(token: str, chat_id: str, frame):
    method = "sendPhoto"
    img_encoded = cv2.imencode('.jpg', frame)[1].tostring()
    files = {'photo': img_encoded}
    url = f"https://api.telegram.org/bot{token}/{method}?chat_id={chat_id}"
    requests.post(url, files=files)

def reset_start_time(start_time, interval: int):
    if time.time() - start_time > interval:  # интервал в секундах
        start_time = time.time()
        return start_time
    else:
        return start_time

async def run_sending_tg_interval(start_time, interval: int, token: str, chat_id: str, message: str, frame):
    if time.time() - start_time > interval:
        send_tg_msg(token, chat_id, message)
        send_tg_img(token, chat_id, frame)


def search_objects_by_id(results, object_ids: list):
    #TODO:  Думаю, как переписать эту функцию... Сейчас она не все классы сохраняет. Что-то не так с перебором...
    #  или с записью результата в переменную.

    for r in results:
        detection_count = r.boxes.shape[0]
        for i in range(detection_count):
            cls = int(r.boxes.cls[i].item())
            name = r.names[cls]
            confidence = float(r.boxes.conf[i].item())
            confidence = format(confidence, '.1%')
            print(cls)
            for object_id in object_ids:
                if object_id == cls:
                    objects_data = id_history[i]
                    objects_data.append((cls, name, confidence))
                    if len(objects_data) > 30:
                        objects_data.pop(0)
    return objects_data

################################Конец вспомогательных функций###################################################


def video_stream(camera):
    # camera = Camera.objects.get()
    model = camera.model
    video_path = camera.address
    print(video_path)
    object_ids = camera.object_id
    token = camera.toke_bot
    chat_id = camera.chat_id
    weights_path = model.model_file_path
    model_settings = model.adress_nastroiki



    # TODO: Придумать, как уйти от модуля time и отправлять уведомления асинхронно периодически....
    start_time = time.time() #Запоминаем, когда запустили видео. Нужно для работы периодической отправки уведомлений.

    if camera.address == "0":
        cap = cv2.VideoCapture(0)  # Используем камеру ноутбука (указываем индекс 0)
    else:
        cap = cv2.VideoCapture(camera.address)
    #Инициализация объекта с потоком видео
    model = YOLO(weights_path)
    track_history = defaultdict(lambda: []) #Инициализация массива для хранения треков
    id_history = defaultdict(lambda: []) #Инициализация массива для хранения найденных ID

    # model.MODE(model_settings) #Пока не включаем, т.к. непонятно, как работает.... https://docs.ultralytics.com/usage/cfg/

# Это цикл считывания видео. Работает пока считываются данные с камеры.
    while cap.isOpened():
        # Считываем видео во фрейм
        success, frame = cap.read()

        if success:
            # Запуск модели ИИ на фрейме
            results = model.track(frame, persist=True)
            # print(results)

            # Визуализация результатов во фрейме
            annotated_frame = results[0].plot(conf=True, boxes=True)

            # Получаем боксы и ID объектов
            if results[0].boxes is not None and results[0].boxes.id is not None:

                boxes = results[0].boxes.xywh.cpu()
                track_ids = results[0].boxes.id.cpu().int().tolist()

                # TODO: Разобраться, почему я отсюда не могу вызвать другие функции и не работает отправка
                #  сообщений в ТГ. Это особенность Django?
                # message = search_objects_by_id(results, object_ids)
                # loop = asyncio.get_event_loop()
                # loop.run_until_complete(run_sending_tg_interval(start_time=start_time, interval=10, token=token,
                #                                                 chat_id=chat_id, message="message",
                #                                                 frame=annotated_frame))
                # loop.close()
                # start_time = reset_start_time(start_time=start_time, interval=10)

                # Просчитываем треки
                for box, track_id in zip(boxes, track_ids):
                    x, y, w, h = box
                    track = track_history[track_id]
                    track.append((float(x), float(y)))  # x, y center point
                    if len(track) > 30:  # retain 90 tracks for 90 frames
                        track.pop(0)

                    # Рисуем треки
                    points = np.hstack(track).astype(np.int32).reshape((-1, 1, 2))
                    cv2.polylines(annotated_frame, [points], isClosed=False, color=(0, 230, 0), thickness=1)
                    points = np.hstack(track).astype(np.int32).reshape((-1, 1, 2))

        # Преобразование фрейма для отображения
        _, buffer = cv2.imencode('.jpg', annotated_frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
