from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch
import torch.nn.functional as F
import string
import os
import google.generativeai as genai
import pytesseract
from PIL import Image
import base64
import io
import os

# Set Tesseract path for Windows (modify as needed)
if os.name == 'nt':  # Windows
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

import logging
logger = logging.getLogger(__name__)

# Configure Gemini API
genai.configure(api_key="AIzaSyBsFP8BcOVilC622PQNqceVolp5EqjJk48")

# Paths to both models
try:
    logger.debug("Loading ML models...")
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    long_model_path = os.path.join(base_dir, "model_lamine")
    short_model_path = os.path.join(base_dir, "malek_model_arabret_darija")

    logger.debug(f"Base directory: {base_dir}")
    logger.debug(f"Long model path: {long_model_path}")
    logger.debug(f"Short model path: {short_model_path}")

    # Load both models and tokenizers once
    long_model = AutoModelForSequenceClassification.from_pretrained(long_model_path)
    long_tokenizer = AutoTokenizer.from_pretrained(long_model_path)
    short_model = AutoModelForSequenceClassification.from_pretrained(short_model_path)
    short_tokenizer = AutoTokenizer.from_pretrained(short_model_path)
    long_model.eval()
    short_model.eval()
    logger.debug("Models loaded successfully")
except Exception as e:
    logger.error(f"Error loading models: {str(e)}")
    raise Exception(f"Failed to load ML models: {str(e)}")

# Label mapping
label_map = {0: "Fake", 1: "Suspicious", 2: "True"}

class CheckView(APIView):
    def get_category(self, text):
        prompt = f"""Classify the topic of the following Arabic text into one clear, high-level category (like Politics, Sports, Health, Religion, Education, Technology, etc.). Reply with only the category word and nothing else:\n\n{text}"""
        try:
            model = genai.GenerativeModel(model_name="models/gemini-2.0-flash-lite")
            response = model.generate_content(prompt)
            return response.text.strip().split('\n')[0]
        except Exception as e:
            raise Exception(f"Error in get_category: {e}")


    def is_arabized(self, text):
        latin_chars = sum(1 for c in text if c in string.ascii_letters)
        ratio = latin_chars / len(text) if text else 0
        return ratio > 0.3

    def convert_to_fusha(self, text):
        prompt = f"Translate the following Arabized Arabic (written in Latin characters) to Modern Standard Arabic (Fus7a) and return just the translated text only:\n\n{text}"

        try:
            model = genai.GenerativeModel(model_name="models/gemini-2.0-flash-lite")
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            raise Exception(f"Error in convert_to_fusha: {e}")

    def extract_text_from_image(self, image_data):
        try:
            # Remove header if present
            if "base64," in image_data:
                image_data = image_data.split("base64,")[1]
            
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes))
            
            # Configure Tesseract for Arabic
            custom_config = r'--oem 3 --psm 6 -l ara'
            
            # Extract text
            extracted_text = pytesseract.image_to_string(image, config=custom_config)
            
            if not extracted_text.strip():
                raise Exception("No text found in image")
            
            return extracted_text.strip()
        except Exception as e:
            raise Exception(f"Error processing image: {str(e)}")

    def post(self, req):
        try:
            logger.debug("Processing check request")
            logger.debug(f"Request data: {req.data}")

            text = req.data.get("text", "")
            image = req.data.get("image", "")
            logger.debug(f"Text length: {len(text)}")

            # If both text and image are empty
            if not text.strip() and not image:
                return Response(
                    {"status": "error", "message": "Either text or image is required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # If image is provided, extract text from it
            if image:
                text = self.extract_text_from_image(image)

            # Detect and convert Arabized text
            if self.is_arabized(text):
                text = self.convert_to_fusha(text)

            # Choose model based on length
            logger.debug(f"Text length for model selection: {len(text)}")
            if len(text) < 300:
                model = short_model
                tokenizer = short_tokenizer
                model_type = "short"
                logger.debug("Using short model")
            else:
                model = long_model
                tokenizer = long_tokenizer
                model_type = "long"
                logger.debug("Using long model")

            # Tokenize input
            logger.debug("Tokenizing text")
            try:
                inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=256)
                logger.debug("Text tokenized successfully")
            except Exception as e:
                logger.error(f"Tokenization error: {str(e)}")
                raise Exception(f"Failed to process text: {str(e)}")

            # Predict
            logger.debug("Running prediction")

            # Predict
            with torch.no_grad():
                outputs = model(**inputs)
                probs = F.softmax(outputs.logits, dim=1).squeeze().tolist()


            prediction_id = torch.argmax(outputs.logits, dim=1).item()
            prediction_label = label_map.get(prediction_id, "Unknown")

            confidence = round(probs[prediction_id], 4)

            # Get category using Gemini
            try:
                category = self.get_category(text)
            except Exception as e:
                category = "Unknown"

            return Response(
                {
                    "status": "success",
                    "text": text,
                    "prediction": prediction_label,
                    "class_id": prediction_id,
                    "category": category,
                    "model_used": model_type,
                    "confidence": confidence
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.error(f"Error in CheckView: {str(e)}")
            logger.exception("Full traceback:")
            return Response(
                {"status": "error", "message": f"Error processing request: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

import logging
logger = logging.getLogger(__name__)

class OCRView(APIView):
    def post(self, request):
        try:
            # Debug logging
            logger.debug("OCR request received")
            logger.debug(f"Request data keys: {request.data.keys()}")

            # Get the base64 image from request
            image_data = request.data.get('image')
            if not image_data:
                logger.error("No image data received")
                return Response(
                    {"status": "error", "message": "Image data is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Convert base64 to image
            try:
                # Debug image data
                logger.debug(f"Image data length: {len(image_data)}")
                logger.debug(f"Image data starts with: {image_data[:50]}")

                # Remove header if present
                if "base64," in image_data:
                    image_data = image_data.split("base64,")[1]
                    logger.debug("Base64 header removed")
                
                image_bytes = base64.b64decode(image_data)
                logger.debug(f"Decoded image bytes length: {len(image_bytes)}")

                image = Image.open(io.BytesIO(image_bytes))
                logger.debug(f"Image opened: size={image.size}, mode={image.mode}")

            except Exception as e:
                logger.error(f"Error decoding image: {str(e)}")
                return Response(
                    {"status": "error", "message": f"Invalid image data: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Configure Tesseract for Arabic
            try:
                logger.debug("Configuring Tesseract")
                custom_config = r'--oem 3 --psm 6 -l ara'
                
                # Check if Tesseract is installed
                try:
                    tesseract_version = pytesseract.get_tesseract_version()
                    logger.debug(f"Tesseract version: {tesseract_version}")
                except Exception as e:
                    logger.error(f"Error getting Tesseract version: {str(e)}")
                    return Response(
                        {"status": "error", "message": "Tesseract not properly configured"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

                # Extract text
                logger.debug("Starting text extraction")
                extracted_text = pytesseract.image_to_string(image, config=custom_config)
                logger.debug(f"Extracted text length: {len(extracted_text)}")
                
                if not extracted_text.strip():
                    logger.warning("No text found in image")
                    return Response(
                        {"status": "error", "message": "No text found in image"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                logger.debug("Text extraction successful")
                return Response(
                    {
                        "status": "success",
                        "text": extracted_text.strip()
                    },
                    status=status.HTTP_200_OK
                )
            except pytesseract.TesseractNotFoundError as e:
                logger.error(f"Tesseract not found: {str(e)}")
                return Response(
                    {"status": "error", "message": "OCR service not properly configured. Please install Tesseract with Arabic support."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            except pytesseract.TesseractError as e:
                logger.error(f"Tesseract error: {str(e)}")
                return Response(
                    {"status": "error", "message": f"Error during OCR processing: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        except Exception as e:
            logger.error(f"Unexpected error in OCR: {str(e)}")
            return Response(
                {"status": "error", "message": f"Unexpected error during image processing: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
