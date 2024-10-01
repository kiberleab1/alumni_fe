import React from "react";
import { FcReading } from "react-icons/fc";
import { PiStudentDuotone } from "react-icons/pi";
import { MdOutlineScience } from "react-icons/md";
import { FaRocket } from "react-icons/fa";
import { GiFlagObjective } from "react-icons/gi";
import { BiSolidLowVision } from "react-icons/bi";

import AOS from "aos";
import "./css.css";
import "aos/dist/aos.css";
import { useEffect } from "react";

const Mission = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: false,
    });
  }, []);
  return (
    //bg-[url('../../../../../public/gallery/ab.png')] bg-cover
    <div className="relative bg-blue-50 min-h-screen w-full flex flex-col items-center justify-center p-4 space-y-6 overflow-hidden z-0">
      <div className="absolute top-0 left-0 w-[150px] h-[150px] rounded-full opacity-30 animate-randomMovement1 flex items-center justify-center">
        <PiStudentDuotone className="w-[50%] h-[50%] text-black" />
      </div>

      <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full opacity-20 animate-randomMovement2 flex items-center justify-center">
        <FcReading className="w-[50%] h-[50%] text-black" />
      </div>

      {/* <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-green-500 rounded-full opacity-25 animate-randomMovement3"></div> */}
      {/* <div className="absolute bottom-0 right-0 w-[100px] h-[100px] bg-yellow-500 rounded-full opacity-30 animate-randomMovement4"></div> */}
      <div className="flex flex-wrap justify-center w-full space-y-6 md:space-y-0 md:space-x-6">
        {[
          {
            title: "Mission",
            icon: <FaRocket className="text-black text-4xl" />,
            description: (
              <ul className="list-disc list-outside  p-0 m-0 text-start">
                <li className="pl-0">
                  Expand youth access to essential services that are more youth
                  friendly
                </li>
                <li className="pl-0">
                  Create new economic opportunities for youth
                </li>
                <li className="pl-0">
                  Expand youth access to essential services that are more youth
                  friendly
                </li>
              </ul>
            ),
          },
          {
            title: "Vision",
            icon: <BiSolidLowVision className="text-black text-4xl" />,
            description:
              "Ethiopian youth who are game changers: empowered to advance their own economic, civic, and social development; resilient in the face of shocks; actively promoting development within their communities and contributing to the country’s peace and prosperity.",
          },
        ].map((card, index) => (
          <div
            key={index}
            className="zoom-card mx-4 bg-white  md:mx-0 w-full sm:w-[90%] md:w-[45%] lg:w-[32%] h-auto sm:h-72 md:h-96 rounded-2xl   p-6 m-2 shadow-sm transition-transform duration-300 ease-in-out"
            data-aos="zoom-in"
            data-aos-duration="1000"
            data-aos-offset="200"
          >
            <div className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-gray-50 duration-300 rounded flex flex-col items-center justify-center h-full ">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-md">
                {card.icon}
              </div>
              <div className="mt-12 ">
                <h1 className="text-black text-2xl font-bold text-center mb-4 font-sans">
                  {card.title}
                </h1>
                <p className="text-gray-900 text-center p-2">
                  {card.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full flex justify-center mt-6 z-100">
        <div
          key={2}
          className="zoom-card  relative w-full sm:w-[90%] md:w-[60%] lg:w-[70%] h-96 rounded-2xl   p-8 shadow-lg transition-transform duration-300 ease-in-out"
          data-aos="zoom-in"
          data-aos-duration="1000"
          data-aos-offset="200"
        >
          <div className="relative z-50 flex flex-col bg-white items-center justify-center h-full p-4 transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 hover:bg-gray-100 duration-300 rounded">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-md ">
              <GiFlagObjective className="text-black text-4xl" />
            </div>
            <div className="relative mt-16  overflow-y-scroll no-scrollbar flex-1 z-100 ">
              <h1 className="text-black text-2xl  font-bold text-center mb-4 font-sans">
                Core Values
              </h1>
              <ul className="list-disc list-inside text-gray-900 text-left space-y-4 font-sans-serif  ">
                <li className="">
                  <strong>Empowerment</strong> - Equip youth with the skills and
                  resources to lead their own development.
                </li>
                <li>
                  <strong>Resilience</strong> - Foster the ability to overcome
                  challenges and adapt to change.
                </li>
                <li>
                  <strong>Youth Leadership</strong> - Prioritize youth-led
                  initiatives in decision-making and community development.
                </li>
                <li className="">
                  <strong>Collaboration</strong> - Build partnerships that drive
                  impactful change.
                </li>
                <li>
                  <strong>Innovation</strong> - Encourage creative solutions for
                  economic and social progress.
                </li>
                <li>
                  <strong>Inclusivity</strong> - Ensure all youth have access to
                  opportunities and support.
                </li>
                <li className="">
                  <strong>Civic Engagement</strong> - Committed to advancing the
                  highest standards in all endeavors.
                </li>
                <li>
                  <strong>Academicabsolute Freedom</strong> - Amplify youth
                  voices in governance and civic affairs.
                </li>
                <li>
                  <strong>Sustainability</strong> - Create lasting impacts
                  through youth-led enterprises and community engagement.
                </li>
              </ul>
            </div>
          </div>
          <div className="absolute top-0 right-0  bg-blue-100 w-[25%] h-[100%] z-10"></div>
          <div className="absolute top-0 left-0  bg-blue-100 w-[25%] h-[100%] z-10"></div>
          {/* <div className="absolute bottom-0 right-0  bg-blue-100 w-[25%] h-[20%] z-10"></div>
          <div className="absolute bottom-0 left-0  bg-blue-100 w-[25%] h-[20%] z-10"></div> */}
        </div>
      </div>
    </div>
  );
};

export default Mission;
