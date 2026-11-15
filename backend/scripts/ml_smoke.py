"""Offline runtime check, not an accuracy test; no trained weights are loaded."""
import os
import tempfile

os.environ.setdefault('YOLO_CONFIG_DIR', tempfile.mkdtemp(prefix='unitai-yolo-test-'))
os.environ['YOLO_AUTOINSTALL'] = 'false'

import numpy as np
import torch
import torchvision
import cv2
from ultralytics import YOLO

model = YOLO('apps/camera/models/yolov8n.yaml')
results = model.track(np.zeros((64, 64, 3), dtype=np.uint8), persist=True, imgsz=64, device='cpu', verbose=False)
assert len(results) == 1
assert results[0].orig_shape == (64, 64)
print('Offline synthetic inference passed:', torch.__version__, torchvision.__version__, cv2.__version__)
