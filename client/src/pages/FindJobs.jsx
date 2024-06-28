import { useEffect, useState } from "react";
import { redirect, useLocation, useNavigate } from "react-router-dom";
import { BiBriefcaseAlt2 } from "react-icons/bi";
import { BsStars } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

import Header from "../components/Header";
import { experience, jobTypes, jobs } from "../utils/data";
import { CustomButton, JobCard, ListBox } from "../components";
import { apiRequest, updateURL } from "../utils";
import CardSkeleton from "../components/CardSkeleton";
import { useSelector } from "react-redux";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { isDropdownOpen, setIsDropdownOpen } from "react";

const FindJobs = () => {
  const [sort, setSort] = useState("Relevant");
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [recordCount, setRecordCount] = useState(0);
  const [data, setData] = useState([]);
  const { user } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [filterJobTypes, setFilterJobTypes] = useState([]);
  const [filterExp, setFilterExp] = useState([]);
  const [expVal, setExpVal] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [filterDepartments, setFilterDepartments] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const sortArrayByString = (searchString, dataArray) => {
    const searchWords = searchString?.toLowerCase().split(" ");

    return dataArray.sort((a, b) => {
      const aTitleWords = a.jobTitle?.toLowerCase().split(" ");
      const bTitleWords = b.jobTitle?.toLowerCase().split(" ");

      const aMatch = searchWords.some((word) => aTitleWords.includes(word));
      const bMatch = searchWords.some((word) => bTitleWords.includes(word));

      if (aMatch && !bMatch) {
        return -1;
      } else if (!aMatch && bMatch) {
        return 1;
      }

      if (b.vacancies !== a.vacancies) {
        return b.vacancies - a.vacancies;
      }
      if (a.application.length !== b.application.length) {
        return a.application.length - b.application.length;
      }
      if (a.experience !== b.experience) {
        return a.experience - b.experience;
      }
      return 0;
    });
  };

  const fetchJobs = async () => {
    setIsFetching(true);
    const newUrl = updateURL({
      pageNum: page,
      query: searchQuery,
      cmpLoc: jobLocation,
      sort: sort,
      navigate: navigate,
      location: location,
      jType: filterJobTypes,
      exp: filterExp,
      dept: filterDepartments,
    });

    try {
      const res = await apiRequest({
        url: "/jobs" + newUrl,
        method: "GET",
      });
      console.log(res);
      setNumPage(res?.numOfPage);
      setRecordCount(res?.totalJobs);
      if (user?.jobTitle && sort == "Relevant") {
        const sortedData = sortArrayByString(user?.jobTitle, res?.data);
        setData(sortedData);
      } else {
        setData(res?.data);
      }
      setTimeout(() => {
        setIsFetching(false);
      }, 100);
    } catch (error) {
      console.log(error);
    }
  };


  const filterJobs = (val) => {
    if (filterJobTypes?.includes(val)) {
      setFilterJobTypes(filterJobTypes.filter((el) => el != val));
    } else {
      setFilterJobTypes([...filterJobTypes, val]);
    }
  };

  const filterExperience = (val) => {
    if (expVal.includes(val)) {
      setExpVal(expVal.filter((el) => el !== val));
    } else {
      setExpVal([...expVal, val]);
    }
    setIsFetching(true);
  };

  const departments = [
    "IT / Telecom",
    "Legal",
    "Finance",
    "Marketing",
    "Insurance",
    // Adaugă alte departamente aici
  ];
  const filterDepartment = (val) => {
    if (filterDepartments.includes(val)) {
      setFilterDepartments(filterDepartments.filter((el) => el !== val));
    } else {
      setFilterDepartments([...filterDepartments, val]);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    await fetchJobs();
  };

  const handleShowMore = async (e) => {
    e.preventDefault();
    setPage((prev) => prev + 1);
  };

  const handleFilterChange = (setFilterFunction, value) => {
    setFilterFunction(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };
  useEffect(() => {
    let newExpVal = [];
    if (expVal.length > 0) {
      expVal.map((el) => {
        const newEl = el.split("-");
        newExpVal.push(Number(newEl[0]), Number(newEl[1]));
      });
      newExpVal.sort((a, b) => a - b);
      setFilterExp(`${newExpVal[0]}-${newExpVal[newExpVal.length - 1]}`);
    } else {
      setFilterExp("");
    }
    fetchJobs();
  }, [expVal, filterDepartments]);

  useEffect(() => {
    const redirectid = localStorage.getItem("redirect");
    if (redirectid) {
      setTimeout(() => {
        navigate(`/job-detail/${redirectid}`);
        localStorage.removeItem("redirect");
      }, 500);
    }
  }, []);

  useEffect(() => {
    document.title = "Home - Find Jobs";
    fetchJobs();
  }, [sort, filterJobTypes, filterExp, filterDepartments, page]);

  return (
    <div className="dark:bg-slate-800">
      <Header
       title={
        <span>
          Get The <span style={{ color: '#504ED7' }}>Right Job</span> You deserve
        </span>
      }
        type="home"
        handleClick={handleSearchSubmit}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        location={jobLocation}
        setLocation={setJobLocation}
      />

      <div className="container mx-auto flex gap-6 2xl:gap-10 md:px-10 py-0 md:py-6 bg-[#f7fdfd] dark:bg-slate-800">
        <div className="hidden md:flex flex-col w-1/6 h-fit bg-white dark:bg-slate-800 shadow-sm">
          <p className="text-lg font-semibold text-slate-600 dark:text-white">
            Filter Search
          </p>

          <div className="py-2">
            <div className="flex justify-between mb-3">
              <p className="flex items-center gap-2 font-semibold dark:text-white">
                <BiBriefcaseAlt2 />
                Job Type
              </p>

              <button>
                <MdOutlineKeyboardArrowDown className="dark:text-white" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {jobTypes.map((jtype, index) => (
                <div key={index} className="flex gap-2 text-sm md:text-base ">
                  <input
                    type="checkbox"
                    value={jtype}
                    className="w-4 h-4"
                    onChange={(e) => handleFilterChange(setFilterJobTypes, e.target.value)}
                  />
                  <span className="dark:text-slate-400">{jtype}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="py-2 mt-4">
            <div className="flex justify-between mb-3">
              <p className="flex items-center gap-2 font-semibold dark:text-white">
                <BsStars className="dark:text-white" />
                Experience
              </p>

              <button>
                <MdOutlineKeyboardArrowDown />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {experience.map((exp) => (
                <div key={exp.title} className="flex gap-3">
                  <input
                    type="checkbox"
                    value={exp?.value}
                    className="w-4 h-4"
                    onChange={(e) => handleFilterChange(setExpVal, e.target.value)}
                  />
                  <span className="dark:text-slate-400">{exp.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="py-2 mt-4">
            <div className="flex justify-between mb-3 cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <p className="flex items-center gap-2 font-semibold dark:text-white">
                <BsStars className="dark:text-white" />
                Department
              </p>
              <button>
                <MdOutlineKeyboardArrowDown className="dark:text-white" />
              </button>
            </div>
            {isDropdownOpen && (
              <ul className="max-h-32 overflow-y-auto border border-gray-300 rounded-md dark:bg-slate-700 dark:text-white">
                {departments.map((dept, index) => (
                  <li key={index} className="flex items-center gap-2 p-0.5">
                    <input
                      type="checkbox"
                      value={dept}
                      className="w-4 h-4"
                      onChange={(e) => handleFilterChange(setFilterDepartments, e.target.value)}
                    />
                    <span className="dark:text-slate-400">{dept}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>



        </div>

        <div className="w-full md:w-5/6 px-5 md:px-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm md:text-base dark:text-slate-400">
              Showing: <span className="font-semibold">{recordCount}</span> Jobs
              Available
            </p>

            <div className="flex flex-col md:flex-row gap-0 md:gap-2 md:items-center">
              <p className="text-sm md:text-base dark:text-slate-400">
                Sort By:
              </p>

              <ListBox sort={sort} setSort={setSort} />
            </div>
          </div>

          <div className="w-full flex flex-wrap gap-5">
            {isFetching && <CardSkeleton cards={data?.length || 20} />}
            {!isFetching &&
              data?.map((job, index) => {
                const newJob = {
                  name: job?.company?.name,
                  logo: job?.company?.profileUrl,
                  ...job,
                };
                return <JobCard job={newJob} key={index} />;
              })}
          </div>

          {numPage > page && !isFetching && (
            <div className="w-full flex items-center justify-center pt-16">
              <CustomButton
                onClick={handleShowMore}
                title="Load More"
                containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindJobs;
