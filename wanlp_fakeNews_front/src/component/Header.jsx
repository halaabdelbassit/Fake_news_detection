import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="p-4 top-0 mx-auto max-w-7xl text-white">
      <div className="flex justify-between items-center px-6 py-3">
        <h1
          onClick={() => navigate("/")}
          className="text-4xl font-bold cursor-pointer hover:text-gray-300 transition-colors"
        >
          مزيَّف
        </h1>
        <nav dir="rtl" className="flex gap-8 text-xl font-medium">
          <button
            onClick={() => navigate("/")}
            className="hover:text-gray-300 transition-colors"
          >
            الرئيسية
          </button>
          <button
            onClick={() => navigate("/about")}
            className="hover:text-gray-300 transition-colors"
          >
            حول
          </button>

          <button
            onClick={() => navigate("/opinions")}
            className="hover:text-gray-300 transition-colors"
          >
            آراء
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
