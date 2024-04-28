import React from 'react';
import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const Intro = () => {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 md:px-16 lg:px-32 relative">
 <div className="absolute inset-0 z-0">
 
 </div>

 <div className="z-10 relative text-center">
    <h1 className="font-semibold text-white mb-8 mt-20">
      <span className='flex items-center justify-center'>
        <img src="logo.png" alt="Logo" className='w-16 mr-4' />
        <span className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-blue-200'>EVOLVE</span>
      </span>
    </h1>
    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-12 fadeIn">
      Discover, Analyze, and GROW
    </div>
    <p className="text-xl sm:text-xl md:text-2xl lg:text-3xl text-white mb-12 fadeIn">
      Get insights and tailored recommendations to boost your YouTube channel's performance.
    </p>
    <Link href="/analytics">
      <button className="border hover:bg-blue-300 hover:text-black text-white font-semibold rounded-lg transition ease-in-out duration-300 w-60 h-12 sm:w-72 md:w-80 lg:w-96">
        EXPLORE NOW
      </button>
    </Link>
 </div>



      <hr />

      <div className="mt-20 mb-20 text-center sm:w-full sm:h-full h-92 w-96">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-white animate-fadeInUp">
          Some Videos that might help you:
        </h2>
        <div>
        <Carousel showThumbs={false} showStatus={false} autoPlay infiniteLoop>
            <div>
              <iframe className='rounded-2xl' width="560" height="315" src="https://www.youtube.com/embed/hPxnIix5ExI" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
            <div>
              <iframe className='rounded-2xl' width="560" height="315" src="https://www.youtube.com/embed/zDWxyxj7cR0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
            <div>
              <iframe className='rounded-2xl' width="560" height="315" src="https://www.youtube.com/embed/Z0zEbrl9KyE" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
            <div>
              <iframe className='rounded-2xl' width="560" height="315" src="https://www.youtube.com/embed/ZPv-es66pAY" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
            <div>
              <iframe className='rounded-2xl' width="560" height="315" src="https://www.youtube.com/embed/X2huNCHDwMQ" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
            <div>
              <iframe className='rounded-2xl' width="560" height="315" src="https://www.youtube.com/embed/H61VgfRXxzw" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>

          </Carousel>

        </div>
        <div className="mt-12 text-center z-40">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 mt-20 text-white animate-fadeInUp z-40">
          Why Choose EVOLVE?
        </h2>
        <ul className="list-disc list-inside text-base p-4 lg:px-96 sm:px-40 rounded-lg sm:text-lg bg-gray-800 space-y-2 z-40 text-white">
          <li className="fadeInLeft p-2 rounded-lg">AI-Powered Analytics</li>
          <li className="fadeInLeft p-2 rounded-lg">Actionable Insights</li>
          <li className="fadeInRight p-2 rounded-lg">Personalized Recommendations</li>
          <li className="fadeInRight p-2 rounded-lg">User-Friendly Interface</li>
        </ul>
      </div>
      </div>
    </div>
  );
};

export default Intro;
