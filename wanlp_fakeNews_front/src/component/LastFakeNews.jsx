import { useState, useEffect } from 'react';

function LastFakeNews() {
  const [news, setNews] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState({});

  useEffect(() => {
    fetchLatestNews();
  }, []);

  const fetchLatestNews = async () => {
    try {
      const response = await fetch('http://localhost:8000/check/aljazeera-news/');
      const result = await response.json();
      
      if (result.status === 'success') {
        setNews(result.data);
        // Check each news item
        result.data.forEach(item => {
          checkNews(item);
        });
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const checkNews = async (newsItem) => {
    try {
      const response = await fetch('http://localhost:8000/check/news/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newsItem.content
        }),
      });
      const result = await response.json();
      
      setVerificationStatus(prev => ({
        ...prev,
        [newsItem.title]: {
          status: result.prediction,
          confidence: result.confidence,
          category: result.category
        }
      }));
    } catch (error) {
      console.error('Error checking news:', error);
    }
  };

  const getStatusLabel = (status) => {
    if (!status) return "تحت التحقق";
    return status === "True" ? "خبر صحيح" : 
           status === "Suspicious" ? "مشكوك فيه" : "خبر مزيف";
  };

  const getStatusClass = (status) => {
    if (!status) return "bg-yellow-100 text-yellow-600";
    return status === "True" ? "bg-green-100 text-green-600" :
           status === "Suspicious" ? "bg-orange-100 text-orange-600" :
           "bg-red-100 text-red-600";
  };

  return (
    <div className="my-12">
      <div className="p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">آخر الأخبار الرائجة</h2>
        <ul className="space-y-4">
          {news.map((item, index) => {
            const verification = verificationStatus[item.title];
            return (
              <li
                key={index}
                className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200"
                dir="rtl"
              >
                <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.content}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-amber-500 text-xs">{item.pub_date}</span>
                  <div className="flex gap-2 items-center">
                    {verification?.category && (
                      <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-xs">
                        {verification.category}
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-lg text-xs ${getStatusClass(verification?.status)}`}>
                      {getStatusLabel(verification?.status)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default LastFakeNews;
