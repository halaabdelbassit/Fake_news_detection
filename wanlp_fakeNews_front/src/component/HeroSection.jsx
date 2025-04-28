import HeroImage from "../assets/hero_image.png";

function HeroSection() {
  return (
    <div className="relative min-h-[80vh] overflow-hidden bg-white/15">
      {/* Background with gradient overlay */}
      {/* <div
        className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900"
       
      /> */}

      {/* Content Container */}
      <div className="relative flex flex-col lg:flex-row items-center justify-between h-full max-w-7xl mx-auto py-16 px-4 text-white">
        {/* Left Section - Text */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center text-center space-y-8 animate-fade-in">
          <h3 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-2 leading-relaxed">
            قبل المشاركة وإعادة النشر، اختبر أخبارك مع{' '}
            <strong className="text-amber-500">"مُزيَف"</strong>{' '}
            وتحقق من المصدر عن كثب
          </h3>
          <h3 className="font-bold text-xl md:text-2xl lg:text-3xl mb-2 leading-relaxed text-gray-300">
            Before sharing and reposting, test your news with{' '}
            <strong className="text-amber-400">"Mozief"</strong>{' '}
            and investigate the source more closely.
          </h3>

          <div className="text-3xl md:text-4xl font-bold space-y-4">
            <h1 className="mb-2 text-amber-500">خليك فطن، خليك آمن</h1>
            <h1 className="text-amber-400">Stay Sharp, Stay Safe</h1>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="w-full lg:w-1/2 flex justify-center items-center mt-12 lg:mt-0 animate-float">
          <img
            src={HeroImage}
            alt="hero image"
            className="w-4/5 md:w-3/4 lg:w-4/5 max-w-lg drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
