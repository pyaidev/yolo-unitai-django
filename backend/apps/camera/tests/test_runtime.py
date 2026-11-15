from io import BytesIO

from django.test import SimpleTestCase
from PIL import Image


class ImageCompatibilityTests(SimpleTestCase):
    def test_png_decode_encode_with_patched_pillow(self):
        data = BytesIO()
        Image.new('RGB', (16, 16), 'blue').save(data, format='PNG')
        data.seek(0)
        with Image.open(data) as image:
            image.load()
            self.assertEqual(image.size, (16, 16))
            self.assertEqual(image.getpixel((0, 0)), (0, 0, 255))
