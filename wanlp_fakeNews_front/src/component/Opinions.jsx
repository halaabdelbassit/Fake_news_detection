import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Opinions() {
  const opinions = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",

      quote:
        "In today's digital age, fake news spreads six times faster than real news. Our research shows that emotional content tends to be shared more frequently, regardless of its accuracy.",
    },
    {
      id: 2,
      name: "Mark Thompson",

      quote:
        "The sophistication of AI-generated fake news is becoming increasingly concerning. We're seeing a 300% rise in deep fake videos and manipulated content since 2020.",
    },
    {
      id: 3,
      name: "Dr. Elena Rodriguez",

      quote:
        "Our studies indicate that 72% of users have encountered fake news on social media, yet only 34% feel confident in their ability to identify it.",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    className: "opinions-slider",
  };

  return (
    <div className="min-h-screen mx-6 lg:mx-16 md:mx-12 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">ماذا قالوا؟</h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          خبراء بارزون يشاركون رؤاهم حول تأثير وتحديات الأخبار المزيفة في
          مجتمعنا الحديث
        </p>
      </div>

      <div className="w-full max-w-4xl mx-auto relative">
        <style>{`
          .opinions-slider {
            padding: 10px 0;
          }
          .opinions-slider .slick-slide {
            padding: 10px;
          }
          .opinions-slider .slick-current {
            transform: scale(1.1);
            z-index: 1;
          }
        `}</style>
        <Slider {...settings}>
          {opinions.map((opinion) => (
            <div key={opinion.id} className="px-4 focus:outline-none">
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center flex-col mb-4">
                  <p className="text-gray-300 italic text-center">"{opinion.quote}"</p>
                  <div className="ml-4">
                    <h3 className="text-white font-semibold">{opinion.name}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default Opinions;
