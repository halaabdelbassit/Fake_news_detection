import HeroSection from "./HeroSection";
import SubmitNews from "./Submeting";
import LastFakeNews from "./LastFakeNews";
import Opinions from "./Opinions";
import About from "./About";
import { useNavigate } from "react-router-dom";

function Home() {
  // const navigate = useNavigate();
  return (
    <div className="min-h-screen mx-10 lg:mx-18 md:mx-12">
      <HeroSection />
      {/* <div>
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={() => navigate("/dashboard")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 inline-block mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v6.586l4.293-4.293a1 1 0 011.414 1.414l-5.707 5.707a1 1 0 01-1.414 0L5.293 6.707a1 1 0 011.414-1.414L10 9.586V3a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          go to dashboard
        </button>
      </div> */}
      <div className="container mx-auto px-4 ">
        <SubmitNews />
        {/* <LastFakeNews /> */}
        <About />
        <Opinions />
      </div>
    </div>
  );
}

export default Home;
