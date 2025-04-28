import { useLocation, useNavigate } from 'react-router-dom';

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const analysisData = location.state;
  console.log(analysisData);

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">لا توجد بيانات تحليل متاحة</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">تحليل الأخبار المزيفة</h2>
          <p className="text-xl text-gray-300 mb-6">تفاصيل نتيجة التحليل</p>

          {/* News Text */}
          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold text-white mb-4 text-right">النص المحلل</h3>
            <p className="text-gray-300 text-right mb-4" dir="rtl">{analysisData.text}</p>
          </div>
        </div>

        {/* Analysis Results */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4 text-right">نتائج التحليل</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
            <div className="p-4 bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-400">التصنيف</div>
              <div className={`text-lg font-semibold ${
                analysisData.prediction === 'Fake' ? 'text-red-500' :
                analysisData.prediction === 'Suspicious' ? 'text-yellow-500' :
                'text-green-500'
              }`}>
                {analysisData.prediction === 'Fake' ? 'خبر مزيف' :
                 analysisData.prediction === 'Suspicious' ? 'خبر مشكوك فيه' :
                 'خبر صحيح'}
              </div>
            </div>
            <div className="p-4 bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-400">نسبة الثقة</div>
              <div className="text-lg font-semibold text-white">
                {Math.round(analysisData.confidence * 100)}%
              </div>
            </div>
            <div className="p-4 bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-400">التصنيف</div>
              <div className="text-lg font-semibold text-white">{analysisData.category}</div>
            </div>
            <div className="p-4 bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-400">النموذج المستخدم</div>
              <div className="text-lg font-semibold text-white">
                {analysisData.model_used === 'short' ? 'النموذج القصير' : 'النموذج الطويل'}
              </div>
            </div>
            <div className="p-4 bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-400">معرف التصنيف</div>
              <div className="text-lg font-semibold text-white">{analysisData.class_id}</div>
            </div>
            <div className="p-4 bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-400">الحالة</div>
              <div className="text-lg font-semibold text-green-500">{analysisData.status}</div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            العودة للصفحة الرئيسية
          </button>
          <span className="text-gray-400">{new Date().toLocaleDateString('ar-EG')}</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;