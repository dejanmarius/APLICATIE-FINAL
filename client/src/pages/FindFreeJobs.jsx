import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import JobCardHome from "../components/JobCardHome";
import ListBoxHome from "../components/ListBoxHome";

const FindFreeJobs = () => {
  const [sort, setSort] = useState("Newest");
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

  const [isFetching, setIsFetching] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

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
    });

    
    console.log("Fetching jobs from URL:", "/jobs/find-jobs-home" + newUrl);

    try {
      const res = await apiRequest({
        url: "/jobs/find-jobs-home" + newUrl,
        method: "GET",
      });

      console.log("Response data:", res.data);

      setNumPage(res.numOfPage);
      setRecordCount(res.totalJobs);
      setData(res.data);

      setTimeout(() => {
        setIsFetching(false);
      }, 100);
    } catch (error) {
      console.log(error);
      setIsFetching(false);
    }
  };

  const filterJobs = (val) => {
    if (filterJobTypes?.includes(val)) {
      setFilterJobTypes(filterJobTypes.filter((el) => el != val));
    } else {
      setFilterJobTypes([...filterJobTypes, val]);
    }
  };

  const filterExperience = async (e) => {
     //setFilterExp(e);
    if (expVal?.includes(e)) {
      setExpVal(expVal?.filter((el) => el != e));
    } else {
      setExpVal([...expVal, e]);
    }
    setIsFetching(true);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    await fetchJobs();
  };

  const handleShowMore = async (e) => {
    e.preventDefault();
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (expVal.length > 0) {
      let newExpVal = [];

      expVal?.map((el) => {
        const newEl = el?.split("-");
        newExpVal.push(Number(newEl[0]), Number(newEl[1]));
      });

      newExpVal?.sort((a, b) => a - b);

      setFilterExp(`${newExpVal[0]}-${newExpVal[newExpVal?.length - 1]}`);
    }else {
      setFilterExp("");
    }
  }, [expVal]);

  useEffect(() => {
    document.title = "Home - Find Jobs";
    fetchJobs();
  }, [sort, filterJobTypes, filterExp, page]);

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

      <div className="container mx-auto flex gap-6 2xl:gap-10 md:px-10 py-0 md:py-6 bg-[#f7fdfd] ">
        <div className="hidden md:flex flex-col w-1/6 h-fit bg-white  shadow-sm">
          <p className="text-lg font-semibold text-slate-600  text-center ">
            Filter Search
          </p>

          <div className="py-2 px-2">
            <div className="flex justify-between mb-3">
              <p className="flex items-center gap-2 font-semibold ">
                <BiBriefcaseAlt2 />
                Job Type
              </p>

              <button>
                <MdOutlineKeyboardArrowDown className="" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {jobTypes.map((jtype, index) => (
                <div key={index} className="flex gap-2 text-sm md:text-base ">
                  <input
                    type="checkbox"
                    value={jtype}
                    className="w-4 h-4"
                    onChange={(e) => {
                      filterJobs(e.target.value);
                      setIsFetching(true);
                    }}
                  />
                  <span className="">{jtype}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="py-2 mt-4 px-2">
            <div className="flex justify-between mb-3">
              <p className="flex items-center gap-2 font-semibold">
                <BsStars/>
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
                    onChange={(e) => {
                      setIsFetching(true);
                      filterExperience(e.target.value);
                    }}
                  />
                  <span className="">{exp.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full md:w-5/6 px-5 md:px-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm md:text-base">
               <span className="font-semibold">{recordCount}</span> Jobs
              Available
            </p>

            <div className="flex flex-col md:flex-row gap-0 md:gap-2 md:items-center">
              <p className="text-sm md:text-base">
                Sort By:
              </p>

              <ListBoxHome sort={sort} setSort={setSort} />
            </div>
          </div>

          <div className="w-full flex flex-wrap gap-8">
            {isFetching && <CardSkeleton cards={data?.length || 20} />}
            {!isFetching &&
              data?.map((job, index) => {
                const newJob = {
                  name: job?.company?.name,
                  logo: job?.company?.profileUrl,
                  ...job,
                };
                return <JobCardHome job={newJob} key={index} />;
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

export default FindFreeJobs;
