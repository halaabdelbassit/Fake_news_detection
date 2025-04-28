import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextImageExtractor from "./TextImageExtractor";
import TextVoiceExtractor from "./TextVoiceExtractor";
import imageIcon from "../assets/photo.svg";

const SUPPORTED_DOMAINS = [
  "aljazeera.net",
  "echoroukonline.com",
  "alarabiya.net",
  "bbc.com/arabic",
  "elkhabar.com"
];

const MIN_TEXT_LENGTH = 20;
const MAX_CHARS = 1500;

function SubmitNews() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [inputType, setInputType] = useState("text");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [scrapedData, setScrapedData] = useState(null);
  const [showImageExtractor, setShowImageExtractor] = useState(false);

  const validateInput = () => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      setError("الرجاء إدخال النص أو الرابط");
      return false;
    }

    if (inputType === "link") {
      try {
        const url = new URL(trimmedText);
        const domain = url.hostname.replace("www.", "");
        if (!SUPPORTED_DOMAINS.some(d => domain.includes(d))) {
          setError("عذراً، هذا الموقع غير مدعوم. المواقع المدعومة هي: الجزيرة، الشروق، العربية، بي بي سي عربي، الخبر");
          return false;
        }
      } catch {
        setError("الرجاء إدخال رابط صحيح");
        return false;
      }
      return true;
    }

    if (trimmedText.length < MIN_TEXT_LENGTH) {
      setError(`النص يجب أن يكون ${MIN_TEXT_LENGTH} حرفًا على الأقل للحصول على تحليل دقيق`);
      return false;
    }
    return true;
  };

  const scrapeUrl = async (url) => {
    try {
      const response = await fetch('http://localhost:5000/scrape/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error && data.error.includes("Unsupported domain")) {
          throw new Error("عذراً، هذا الموقع غير مدعوم. المواقع المدعومة هي: الجزيرة، الشروق، العربية، بي بي سي عربي، الخبر");
        } else if (data.error && data.error.includes("Scraping error")) {
          throw new Error("حدث خطأ أثناء محاولة استخراج المحتوى. يرجى التأكد من صحة الرابط والمحاولة مرة أخرى");
        } else {
          throw new Error(data.error || 'فشل في استخراج المحتوى من الرابط');
        }
      }

      if (!data.content || data.content === "Content not found") {
        throw new Error("لم نتمكن من العثور على محتوى في هذا الرابط");
      }

      // Only set the data if we have valid content
      const validContent = data.content.trim();
      if (!validContent) {
        throw new Error("المحتوى المستخرج فارغ");
      }

      setText(validContent);
      setScrapedData({
        content: validContent,
        title: data.title || '',
        date: data.publication_date || ''
      });
      return data;
    } catch (error) {
      console.error('Scraping error:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    setProgress(0);
    
    const timer = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 500);

    try {
      // Step 1: Handle URL scraping if needed
      if (inputType === "link") {
        console.log("Scraping URL...");
        await scrapeUrl(text);
        console.log("URL scraped successfully");
      }

      // Step 2: Prepare content for analysis
      const contentToAnalyze = scrapedData?.content || text.trim();
      console.log("Content length for analysis:", contentToAnalyze.length);
      
      if (!contentToAnalyze) {
        throw new Error("لا يمكن تحليل محتوى فارغ");
      }

      // Step 3: Prepare request data
      const requestData = {
        text: contentToAnalyze
      };
      console.log("Sending request to analysis API...");

      // Step 4: Set up request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.log("Request timed out");
      }, 60000);

      try {
        // Step 5: Make API request
        const response = await fetch('http://localhost:8000/check/', {
          signal: controller.signal,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(requestData)
        });
        console.log("Received response:", response.status);

        clearTimeout(timeoutId);

        // Step 6: Parse response
        let data;
        try {
          const textResponse = await response.text();
          console.log("Raw response:", textResponse);
          data = JSON.parse(textResponse);
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          throw new Error('خطأ في تحليل استجابة الخادم');
        }

        // Step 7: Validate response
        if (!response.ok) {
          throw new Error(data.message || 'حدث خطأ أثناء تحليل النص');
        }

        console.log("Analysis result:", data);
        setProgress(100);
        setResult(data);

      } catch (fetchError) {
        // Handle fetch-specific errors
        if (fetchError.name === 'AbortError') {
          throw new Error('انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.');
        }
        throw fetchError;
      }

    } catch (err) {
      console.error('Error during check:', err);
      
      // Clear any existing progress
      setProgress(0);
      
      // Handle specific error cases
      if (err.name === 'AbortError') {
        setError('انتهت مهلة الاتصال (60 ثانية). يرجى تحديث الصفحة والمحاولة مرة أخرى.');
      } else if (err.name === 'TypeError' && err.message.includes('NetworkError')) {
        setError('تعذر الاتصال بالخادم. تأكد من تشغيل الخادم وأن اتصالك بالإنترنت مستقر.');
      } else if (err.message.includes('JSON')) {
        setError('حدث خطأ في معالجة البيانات. يرجى المحاولة مرة أخرى أو الاتصال بالدعم الفني.');
      } else if (err.message.includes('تحليل استجابة')) {
        setError('تعذر تحليل استجابة الخادم. تأكد من صحة البيانات المدخلة وحاول مرة أخرى.');
      } else {
        setError(`خطأ في التحليل: ${err.message || 'حدث خطأ غير متوقع'}`);
      }
      
      // Reset result
      setResult(null);
    } finally {
      clearInterval(timer);
      setIsLoading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const handleTextExtracted = (newText) => {
    setText(current => current + ' ' + newText.trim());
    if (error) setError(null);
    setShowImageExtractor(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] py-8 px-4">
      <div className="w-full max-w-lg bg-white/70 rounded-2xl shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <select
            value={inputType}
            onChange={(e) => {
              setInputType(e.target.value);
              setText("");
              setError(null);
              setResult(null);
              setScrapedData(null);
              setShowImageExtractor(false);
            }}
            className="bg-amber-300 px-4 py-2 rounded-lg text-gray-900 font-medium hover:bg-amber-400 transition-colors"
            dir="rtl"
          >
            <option value="text">نص</option>
            <option value="link">رابط</option>
          </select>
          <h2 className="text-xl font-bold text-gray-800">تحليل الأخبار المزيفة</h2>
        </div>

        {/* Main Input Area */}
        <div className="relative mt-4">
          <textarea
            name="submit"
            value={text}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue.length <= MAX_CHARS) {
                setText(newValue);
                if (error) setError(null);
              }
            }}
            className="w-full h-60 rounded-xl bg-gray-50 p-4 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white border border-gray-200 placeholder:text-gray-500 text-right resize-none"
            placeholder={
              inputType === "link"
                ? "أدخل رابط الخبر من الجزيرة، الشروق،أو الخبر..."
                : "انسخ نص الخبر ..."
            }
            dir="rtl"
          />
          
          {/* Character Counter */}
          <div className="absolute bottom-3 left-3 text-gray-500 text-sm">
            {text.length}/{MAX_CHARS}
          </div>

          {/* Input Controls */}
          {inputType === "text" && (
            <div className="absolute bottom-3 right-3 flex items-center space-x-4">
              <TextVoiceExtractor
                onTextExtracted={handleTextExtracted}
                disabled={isLoading}
              />
              <button
                onClick={() => setShowImageExtractor(prev => !prev)}
                className={`flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isLoading}
              >
                <img src={imageIcon} alt="upload image" className="w-5 h-5" />
                <span className="ml-2">استخدام صورة</span>
              </button>
            </div>
          )}
        </div>

        {/* Image Extractor Panel */}
        {showImageExtractor && inputType === "text" && (
          <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
            <TextImageExtractor
              onTextExtracted={handleTextExtracted}
              disabled={isLoading}
            />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 text-red-600 text-center bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => {
              setText("");
              setError(null);
              setResult(null);
              setShowImageExtractor(false);
            }}
            disabled={isLoading}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-gray-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            مسح
          </button>
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || isLoading || (inputType === "text" && text.length < MIN_TEXT_LENGTH)}
            className={`bg-amber-500 text-white px-8 py-3 rounded-lg font-medium shadow-md transition-colors
              ${(!text.trim() || (inputType === "text" && text.length < MIN_TEXT_LENGTH))
                ? 'bg-gray-300 cursor-not-allowed'
                : 'hover:bg-amber-600'}`}
            title={inputType === "text" && text.trim() && text.length < MIN_TEXT_LENGTH
              ? 'النص يجب أن يكون 20 حرفًا على الأقل'
              : inputType === "link" && !text.trim()
                ? 'الرجاء إدخال رابط'
                : ''}
          >
            {isLoading ? "جاري التحليل..." : "تحليل الخبر"}
          </button>
        </div>

        {/* Loading Progress */}
        {isLoading && (
          <div className="mt-6">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex flex-col items-center mt-2 gap-1">
              <p className="text-amber-600 text-center text-sm font-medium">
                {progress < 20 ? "جاري التحقق من المدخلات..." :
                 progress < 40 ? "جاري تحضير النص للتحليل..." :
                 progress < 60 ? "جاري تحليل المحتوى..." :
                 progress < 80 ? "جاري التحقق من موثوقية النص..." :
                 progress < 100 ? "جاري معالجة النتائج..." :
                 "اكتمل التحليل"}
              </p>
              <p className="text-gray-500 text-xs">
                {progress < 100 ? "يرجى الانتظار، قد تستغرق العملية بضع ثوانٍ" : ""}
              </p>
            </div>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="mt-6 bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
            {/* Content Display for URL input */}
            {inputType === "link" && scrapedData && (
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-800 text-right mb-2">محتوى المقال:</h3>
                <div className="bg-gray-50 p-3 rounded-lg text-right text-gray-700">
                  <p className="font-bold mb-2">{scrapedData.title}</p>
                  <p className="text-sm text-gray-500 mb-3">{scrapedData.date}</p>
                  <p className="whitespace-pre-wrap">{scrapedData.content}</p>
                </div>
              </div>
            )}
            
            {/* Result Header */}
            <div className="bg-gray-50 p-4">
              <div className="flex flex-col gap-3">
                <div className="flex justify-end items-center gap-2">
                  <span className="text-xl" title={result.category}>
                    {result.category === 'Politics' ? '🏛️' :
                     result.category === 'Sports' ? '⚽' :
                     result.category === 'Entertainment' ? '🎭' :
                     result.category === 'Technology' ? '💻' :
                     result.category === 'Health' ? '🏥' :
                     result.category === 'Business' ? '💼' : '📰'}
                  </span>
                  <span className="text-gray-600 font-medium">
                    تصنيف الخبر: {result.category}
                  </span>
                </div>
                <div className="text-right flex flex-col gap-4">
                  <p className="text-xl">
                    <span className="text-gray-700">نتيجة التحليل: هذا الخبر</span>
                    <span className={`font-bold mx-2 ${
                      result.class_id === 0 ? 'text-red-600' :
                      result.class_id === 1 ? 'text-amber-600' :
                      'text-green-600'
                    }`}>
                      {result.class_id === 0 ? 'مزيف بنسبة كبيرة' :
                       result.class_id === 1 ? 'مشكوك في صحته' :
                       'صحيح وموثوق'}
                    </span>
                  </p>
                  <button
                    onClick={() => {
                      navigate('/dashboard', { state: result });
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors w-fit mr-auto"
                  >
                    عرض التفاصيل
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubmitNews;
