function About() {
    return (
        <div className="min-h-screen bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-white mb-8">حول المنصة</h2>
                    <p className="mt-4 text-xl text-gray-300 leading-8 text-right max-w-3xl mx-auto">
                        منصتنا هي أداة متقدمة للكشف عن الأخبار المزيفة، تجمع بين قوة الذكاء الاصطناعي والتحليل اللغوي المتطور للمساعدة في تحديد مصداقية المحتوى الإخباري.
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-gray-800 rounded-lg p-6 text-right">
                        <div className="flex justify-end mb-4">
                            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-4">الدقة والموثوقية</h3>
                        <p className="text-gray-300">
                            نستخدم خوارزميات متقدمة وتقنيات معالجة اللغة الطبيعية للتحقق من مصداقية الأخبار بدقة عالية
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 text-right">
                        <div className="flex justify-end mb-4">
                            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-4">التحليل الفوري</h3>
                        <p className="text-gray-300">
                            نوفر تحليلاً فورياً للمحتوى الإخباري، مما يساعد المستخدمين في اتخاذ قرارات سريعة ومستنيرة
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 text-right">
                        <div className="flex justify-end mb-4">
                            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-4">التوعية المستمرة</h3>
                        <p className="text-gray-300">
                            نقدم موارد تعليمية وإرشادات لمساعدة المستخدمين في تطوير مهاراتهم في التحقق من الأخبار
                        </p>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        نحن نسعى جاهدين لبناء مجتمع أكثر وعياً ومعرفة، حيث يمكن للجميع الوصول إلى معلومات موثوقة وصحيحة.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default About;