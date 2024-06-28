import React from "react";
import { AiOutlineSearch, AiOutlineCloseCircle } from "react-icons/ai";
import { CiLocationOn } from "react-icons/ci";
import CustomButton from "./CustomButton";
import { popularSearch } from "../utils/data";
import "animate.css";
import animationData from "../assets/animation.json";

import searchConceptLandingPage from "../assets/search-concept-landing-page.png";

const SearchInput = ({ placeholder, icon, value, setValue, styles }) => {
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const clearInput = () => setValue("");

  return (
    <div className={`flex w-full md:w-1/3 items-center ${styles}`}>
      {icon}

      <input
        value={value}
        onChange={(e) => handleChange(e)}
        type="text"
        className="w-full md:w-64 p-2 outline-none bg-transparent text-base"
        placeholder={placeholder}
      />

      <AiOutlineCloseCircle
        className="hidden md:flex text-gray-600 text-xl cursor-pointer"
        onClick={clearInput}
      />
    </div>
  );
};

const Header = ({
  title,
  type,
  handleClick,
  searchQuery,
  setSearchQuery,
  location,
  setLocation,
}) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="bg-[#f7fdfd] animate__animated animate__fadeIn">
      <div
        className={`container mx-auto px-10 ${
          type ? "h-[450px]" : "h-[350px]"
        } flex items-center relative`}
      >
        <div className="w-full z-10">
          <div className="mb-8">
            <p className="text-slate-700  font-bold text-4xl">
              {title}
            </p>
          </div>

          <div className="w-full flex items-center justify-around bg-white px-4 md:px-5 py-2.5 md:py-2 shadow-2xl  rounded-full ">
            <SearchInput
              placeholder="Job title or keyword"
              icon={
                <AiOutlineSearch className="text-gray-600  text-xl" />
              }
              value={searchQuery}
              setValue={setSearchQuery}
            />
            <SearchInput
              placeholder="Location"
              icon={
                <CiLocationOn className="text-gray-600 text-xl" />
              }
              value={location}
              setValue={setLocation}
              styles={"hidden md:flex"}
            />

            <div>
              <CustomButton
                onClick={handleClick}
                title="Search"
                containerStyles={
                  "text-white py-2 md:py3 px-3 md:px-10 focus:outline-none bg-customBlue rounded-full md:rounded-md text-sm md:text-base"
                }
              />
            </div>
          </div>
        </div>

        <div className="w-1/3 h-full absolute top-24 mt-8 md:-top-6 lg:-top-14 right-20  2xl:right-[18rem]">
        <img src={searchConceptLandingPage} className="object-contain" />
          
        </div>
      </div>
    </div>
  );
};

export default Header;
