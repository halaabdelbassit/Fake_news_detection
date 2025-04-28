import { useState, useRef, useEffect } from "react";

const TextVoiceExtractor = ({ onTextExtracted, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'ar'; // Set to Arabic
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onTextExtracted(transcript);
        setIsRecording(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError('حدث خطأ في التعرف على الصوت');
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [onTextExtracted]);

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      setError('التعرف على الصوت غير مدعوم في هذا المتصفح');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
      setError(null);
    }
  };

  return (
    <>
      <button
        onClick={handleVoiceInput}
        className={`flex items-center space-x-2 ${
          disabled
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-600 hover:text-gray-900 transition-colors'
        }`}
        disabled={disabled}
        title={disabled ? 'الرجاء الانتظار حتى اكتمال التحليل الحالي' : ''}
      >
        <span className="ml-2">
          {isRecording ? 'إيقاف التسجيل' : 'بدء التسجيل'}
        </span>
        <span className={`text-xl ${isRecording ? 'animate-pulse text-red-500' : ''}`}>
          🎤
        </span>
      </button>
      {error && (
        <div className="text-sm text-red-600 mt-2">
          {error}
        </div>
      )}
    </>
  );
};

export default TextVoiceExtractor;