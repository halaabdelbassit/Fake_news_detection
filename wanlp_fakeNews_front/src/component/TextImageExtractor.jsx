import { useState, useRef } from "react";
import imageIcon from "../assets/photo.svg";
import axios from 'axios';

const TextImageExtractor = ({ onTextExtracted, disabled }) => {
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const extractTextFromImage = async (file) => {
    try {
      setIsProcessingImage(true);
      setError('جاري معالجة الصورة...');

      // Convert image file to base64
      const reader = new FileReader();
      const base64Promise = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const base64Image = await base64Promise;

      // Send to backend OCR endpoint
      const response = await axios.post('http://localhost:8000/check/ocr/', {
        image: base64Image
      });

      if (response.data.status === 'error') {
        throw new Error(response.data.message);
      }

      const extractedText = response.data.text;
      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('لم يتم العثور على نص في الصورة. تأكد من أن الصورة تحتوي على نص عربي واضح');
      }

      setError(null);
      return extractedText.trim();
    } catch (error) {
      console.error('OCR Error:', error);
      if (error.message.includes('load') || error.message.includes('initialize')) {
        throw new Error('فشل في تحميل محرك معالجة الصور. الرجاء تحديث الصفحة والمحاولة مرة أخرى');
      } else if (error.message.includes('memory')) {
        throw new Error('حجم الصورة كبير جداً. الرجاء استخدام صورة أصغر');
      } else if (error.message.includes('network')) {
        throw new Error('حدث خطأ في الاتصال. الرجاء التحقق من اتصالك بالإنترنت');
      } else {
        throw new Error(error.message || 'فشل في استخراج النص من الصورة. تأكد من أن الصورة واضحة وتحتوي على نص عربي');
      }
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleImageSelect = async (file) => {
    if (!file) return;

    // File type validation
    if (!file.type.startsWith('image/')) {
      setError("الرجاء اختيار ملف صورة صالح");
      return;
    }

    // File size validation (5MB)
    if (file.size > 5000000) {
      setError("حجم الصورة يجب أن لا يتجاوز 5 ميغابايت");
      return;
    }

    // Image dimensions validation
    const img = new Image();
    const imageUrl = URL.createObjectURL(file);
    
    try {
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      // Check image dimensions (max 4000x4000 pixels)
      if (img.width > 4000 || img.height > 4000) {
        setError("أبعاد الصورة كبيرة جداً. الحد الأقصى هو 4000×4000 بكسل");
        return;
      }

      setSelectedImage(file);
      setImagePreview(imageUrl);
      
      // Extract text from image
      const extractedText = await extractTextFromImage(file);
      onTextExtracted(extractedText);
    } catch (error) {
      setError(error.message || "حدث خطأ أثناء معالجة الصورة");
      URL.revokeObjectURL(imageUrl);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleImageSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setError(null);
  };

  return (
    <div className="relative">
      {/* Drag & Drop Area */}
      <div
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 transition-all
          ${isDragging 
            ? 'border-amber-500 bg-amber-50' 
            : selectedImage 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-300 hover:border-amber-500 hover:bg-gray-50'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Image Input */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageSelect(e.target.files[0])}
          ref={fileInputRef}
          className="hidden"
        />

        {/* Preview Area */}
        {imagePreview ? (
          <div className="relative w-full max-w-md mx-auto">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-auto rounded-lg shadow-md"
            />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
              title="حذف الصورة"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center justify-center space-x-2 p-4 rounded-lg transition-colors
                ${disabled || isProcessingImage
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-amber-100'
                }`}
              disabled={disabled || isProcessingImage}
            >
              <img
                src={imageIcon}
                alt="upload image"
                className="w-8 h-8"
              />
              <span className="text-gray-600 mr-2">
                {isProcessingImage
                  ? 'جاري استخراج النص...'
                  : disabled
                    ? 'جاري التحليل...'
                    : 'اسحب وأفلت الصورة هنا أو اضغط للاختيار'}
              </span>
            </button>
            <p className="text-sm text-gray-500 mt-2">
              حجم الملف الأقصى: 5 ميغابايت | الأبعاد القصوى: 4000×4000 بكسل
            </p>
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessingImage && (
          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent mx-auto"></div>
              <p className="text-sm mt-2 text-gray-700">جاري معالجة الصورة...</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default TextImageExtractor;