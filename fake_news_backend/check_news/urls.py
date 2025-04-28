from django.urls import path
from .views import CheckView, OCRView

urlpatterns = [
    path("", CheckView.as_view(), name='check'),
    path("ocr/", OCRView.as_view(), name='ocr')
]