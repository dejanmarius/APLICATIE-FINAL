import { GoLocation } from "react-icons/go";
import moment from "moment";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CustomButton from "./CustomButton";

const JobCardHome = ({ job }) => {
  return (
    <Link to={`/jobs-detail/${job?._id}`}>  {/* Link to job detail page */}
      <div
        className="w-full md:w-[16rem] 2xl:w-[30rem] h-[16rem] md:h-[16rem] bg-white  flex flex-col justify-between shadow-lg 
                rounded-md px-3 py-5 "
      >
        <div className="w-full h-full flex flex-col justify-center ">
          <div className="flex gap-3">
            <img
              src={job?.logo}
              alt={job?.name}
              className="w-14 h-14 rounded-lg"
            />

            <div className="w-full h-12 flex flex-col justify-center ">
              <p className="w-full h-12 flex items-center overflow-hidden leading-5 text-lg font-semibold">
                {job?.jobTitle}
              </p>
              <span className="flex gap-1 items-center  ">
                <GoLocation className="text-slate-900 text-sm" />
                {job?.location}
              </span>
            </div>
          </div>

          <div className="py-7">
            <p className="text-sm line-clamp-3">
              {job?.detail[0]?.desc}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="bg-[#1d4fd826] text-customBlue  py-0.5 px-1.5 rounded font-semibold text-sm">
              {job?.jobType}
            </p>
            <span className="text-gray-500 text-sm">
              {moment(job?.createdAt).fromNow()}
            </span>
          </div>
        </div>
        
       
      </div>
      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
      
    </Link>
  );
};

export default JobCardHome;
