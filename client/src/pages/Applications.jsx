import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiRequest } from "../utils";
import { BiChevronDown, BiChevronUp} from "react-icons/bi";
import "../index.css";
import ApplicationSkeleton from "./ApplicationSkeleton";

function Applications() {
  const { user } = useSelector((state) => state.user);
  const [application, setApplications] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  const getAllApplications = async () => {
    const userId = user._id;

    try {
      const res = await apiRequest({
        url: "/users/get-user-applications",
        data: { userId },
        token: user?.token,
        method: "GET",
      });
      setApplications(res?.data);
      setIsFetching(false);
    } catch (err) {
      setIsFetching(false);
      console.log(err);
    }
  };

  useEffect(() => {
    getAllApplications();
  }, []);

  return (
    <div className="dark:bg-slate-800 p-2 sm:p-20">
      {isFetching && <ApplicationSkeleton cards={4} />}
      {application?.length < 1 && !isFetching ? (
        <div className="flex flex-col gap-6 items-center justify-center">
          <h1 className="text-3xl">No Pending Applications</h1>
          <Link className="text-xl hover:underline  hover:text-customBlue" to="/">
            Continue Job Search
          </Link>
        </div>
      ) : (
        <>
          {!isFetching &&
            application?.map((application) => (
              <ApplicationCard
                length={application.length}
                key={application.jobId}
                application={application}
              />
            ))}
        </>
      )}
    </div>
  );
}

const ApplicationCard = ({ application, length }) => {
  const [job, setJob] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const getJobDetails = async () => {
    try {
      const res = await apiRequest({
        url: "/jobs/get-job-detail/" + application.jobId,
        method: "GET",
      });
      setJob(res?.data);
      setTimeout(() => {
        setIsFetching(false);
      }, 100);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getJobDetails();
  }, []);

  return (
    <>
      {isFetching ? (
        <ApplicationSkeleton cards={length} />
      ) : (
        <div className="flex flex-col mb-4 rounded-md justify-between gap-8 shadow-lg p-2 sm:p-12 ">
          <div className="flex flex-col sm:flex-row justify-between gap-8">
            <div className="flex flex-row items-center justify-center gap-4">
              <img
                className="w-16 rounded-[50%]"
                src={job?.company?.profileUrl}
              />
              {application?.status !== "called" ? (
                <p
                  className={`${application.status === "declined" &&
                    "text-red-600"
                    } text-lg sm:text-xl`}
                >
                  Your Application for {job?.jobTitle} is {application?.status}
                </p>
              ) : (
                <p className="text-green-600 text-lg sm:text-xl">
                  Congratulation!! You have been called for interview at{" "}
                  {job?.company?.name}
                </p>
              )}
            </div>
            <div
              className="flex flex-row justify-between items-center"
              onClick={() => setIsDetailOpen((prev) => !prev)}
            >
              <a className="font-bold sm:text-lg hover:cursor-pointer ">
                {isDetailOpen ? "Hide details" : "View details"}
              </a>
              {isDetailOpen ? (
                <BiChevronUp className="" />
              ) : (
                <BiChevronDown className="" />
              )}
            </div>
          </div>
          {isDetailOpen && (
            <div className="grid grid-cols-1 md:grid-cols-3 ">
              <div>
                <h1 className="font-bold text-3xl ">
                  Company Info
                </h1>
                <p className="font-bold dark:text-slate-400">
                  Company:{" "}
                  <span className="font-normal hover:cursor-pointer hover:text-customBlue">
                    <a
                      href={`http://localhost:5173/company-profile/${job?.company?._id}`}
                    >
                      {job?.company?.name}
                    </a>
                  </span>
                </p>
                <p className="font-bold dark:text-slate-400">
                  Email:{" "}
                  <span className="font-normal">{job?.company?.email}</span>
                </p>
              </div>
              <div>
                <h1 className="font-bold text-3xl">Job Info</h1>
                <p className="font-bold ">
                  Type: <span className="font-normal">{job?.jobType}</span>
                </p>
                <p className="font-bold ">
                  Location: <span className="font-normal">{job?.location}</span>
                </p>
                <p className="font-bold ">
                  Starting Salary:{" "}
                  <span className="font-normal">{job?.salary}</span>
                </p>
              </div>
              {application.status === "called" && (
                <div>
                  <h2 className="font-bold text-3xl ">
                    Interview Information
                  </h2>
                  <p className="font-bold ">
                    Date:{" "}
                    <span className="font-normal">
                      {application?.interviewDate}
                    </span>
                  </p>
                  <p className="font-bold ">
                    Time:{" "}
                    <span className="font-normal">
                      {application?.interviewTime}
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Applications;
