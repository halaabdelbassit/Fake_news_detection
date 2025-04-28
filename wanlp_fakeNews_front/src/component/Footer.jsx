import facebookIcon from "../assets/facebook.svg";
import instagramIcon from "../assets/instagram.svg";
import linkedinIcon from "../assets/linkedin.svg";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full bg-gray-800 text-white py-4 flex flex-col justify-center items-center relative bottom-0 left-0"
      dir="rtl"
    >
      <div className="flex flex-col md:flex-row justify-between items-start w-full max-w-6xl px-4 gap-8">
        {/* Feedback Form Section */}
        <div className="flex flex-col justify-center items-center gap-3 w-full md:w-1/3">
          <h1 className="font-bold text-2xl mb-2">شاركنا رأيك حول المنصة</h1>
          <input
            type="text"
            placeholder="الاسم"
            className="rounded-lg px-4 py-2 bg-gray-700 w-full text-white placeholder:text-gray-400 border border-gray-600 focus:border-amber-500 focus:outline-none"
          />
          <textarea
            placeholder="رأيك حول المنصة..."
            className="rounded-lg px-4 py-2 bg-gray-700 w-full h-32 text-white placeholder:text-gray-400 border border-gray-600 focus:border-amber-500 focus:outline-none resize-none"
          />
          <button className="bg-amber-500 text-white px-8 py-2 rounded-lg hover:bg-amber-600 transition-colors">
            إرسال
          </button>
        </div>

        {/* Social Media Section */}
        <div className="w-full md:w-1/3">
          <h2 className="text-2xl text-center font-semibold mb-4">تابعونا على</h2>
          <ul className="flex items-center flex-col gap-4">
            <li>
              <a
                href="#facebook"
                className="flex items-center gap-3 hover:text-amber-500 transition-colors"
              >
                <img src={facebookIcon} alt="Facebook" className="w-6 h-6" />
                <span>فايسبوك</span>
              </a>
            </li>
            <li>
              <a
                href="#instagram"
                className="flex items-center gap-3 hover:text-amber-500 transition-colors"
              >
                <img src={instagramIcon} alt="Instagram" className="w-6 h-6" />
                <span>انستاغرام</span>
              </a>
            </li>
            <li>
              <a
                href="#linkedin"
                className="flex items-center gap-3 hover:text-amber-500 transition-colors"
              >
                <img src={linkedinIcon} alt="LinkedIn" className="w-6 h-6" />
                <span>لينكدإن</span>
              </a>
            </li>
          </ul>
        </div>
        {/* Links Section */}
        <div className="w-full md:w-1/3">
          <h2 className="text-3xl text-center font-bold mb-4">مزيَّف</h2>
          <ul className="flex flex-col items-center gap-4 text-lg">
            <li>
              <a
                href="#testimonials"
                className="hover:text-amber-500 transition-colors"
              >
                آراء المستخدمين
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="hover:text-amber-500 transition-colors"
              >
                حول المنصة
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-amber-500 transition-colors">
                الأسئلة الشائعة (FAQ)
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full border-t border-gray-700 mt-8">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-gray-400">
            &copy; {currentYear} مزيَّف - جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
