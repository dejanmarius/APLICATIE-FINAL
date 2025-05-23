import { useEffect, useState } from "react";
import { Linkedin } from "../assets";
import moment from "moment";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import { Link, useParams } from "react-router-dom";
import { jobs } from "../utils/data";
import { CustomButton, JobCard, Loading } from "../components";
import { useSelector } from "react-redux";
import { apiRequest } from "../utils";

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.user);
  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [selected, setSelected] = useState("0");
  const [isFetching, setIsFetching] = useState(false);

  const getJobDetails = async () => {
    setIsFetching(true);

    try {
      const res = await apiRequest({
        url: "/jobs/get-job-detail/" + id,
        method: "GET",
      });

      setJob(res?.data);
      setSimilarJobs(res?.similarJobs);
      setIsFetching(false);
    } catch (error) {
      setIsFetching(false);
      console.log(error);
    }
  };

  const handleDeletePost = async () => {
    setIsFetching(true);

    try {
      if (window.confirm("Delete Job Post?")) {
        const res = await apiRequest({
          url: "jobs/delete-job/" + job?._id,
          token: user?.token,
          method: "DELETE",
        });

        if (res?.success) {
          alert(res?.messsage);
          window.location.replace("/");
        }
      }
      setIsFetching(false);
    } catch (error) {
      setIsFetching(false);
      console.log(error);
    }
  };

  useEffect(() => {
    document.title = "Job Detail";
    id && getJobDetails();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [id]);

  return (
    <div className="w-full dark:bg-slate-800">
      <div className="container mx-auto ">
        <div className=" w-full flex flex-col md:flex-row gap-10 ">
          {/* LEFT SIDE */}
          {isFetching ? (
            <Loading />
          ) : (
            <div className="dark:bg-slate-700 w-full h-fit md:w-2/3 2xl:2/4 bg-white px-5 py-10 md:px-10 shadow-md">
              <div className="w-full flex items-center justify-between">
                <div className="w-3/4 flex gap-2">
                  <img
                    src={job?.company?.profileUrl}
                    alt={job?.company?.name}
                    className="w-20 h-20 md:w-24 md:h-20 rounded"
                  />

                  <div className="flex flex-col">
                    <p className="text-xl font-semibold text-gray-600 dark:text-white">
                      {job?.jobTitle}
                    </p>

                    <span className="text-base dark:text-white">
                      {job?.location}
                    </span>

                    <span className="text-base text-blue-600 dark:text-white">
                      {job?.company?.name}
                    </span>

                    <span className="text-gray-500 text-sm dark:text-white">
                      {moment(job?.createdAt).fromNow()}
                    </span>
                  </div>
                </div>

                <div className="">
                  <AiOutlineSafetyCertificate className="text-3xl text-blue-500" />
                </div>
              </div>

              <div className="w-full flex flex-wrap md:flex-row gap-2 items-center justify-between my-10">
                <div className="bg-[#bdf4c8] w-40 h-16 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-sm">Salary</span>
                  <p className="text-lg font-semibold text-gray-700">
                   {job?.salary} €
                  </p>
                </div>

                <div className="bg-[#bae5f4] w-40 h-16 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-sm">Job Type</span>
                  <p className="text-lg font-semibold text-gray-700">
                    {job?.jobType}
                  </p>
                </div>

                <div className="bg-[#fed0ab] w-40 h-16 px-6 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-sm">No. of Applicants</span>
                  <p className="text-lg font-semibold text-gray-700">
                    {job?.application?.length}
                  </p>
                </div>

                <div className="bg-[#cecdff] w-40 h-16 px-6 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-sm">No. of Vacancies</span>
                  <p className="text-lg font-semibold text-gray-700">
                    {job?.vacancies}
                  </p>
                </div>

                <div className="bg-[#ffcddf] w-40 h-16 px-6 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-sm">Yr. of Experience</span>
                  <p className="text-lg font-semibold text-gray-700">
                    {job?.experience}
                  </p>
                </div>

                {/* <div className="bg-[#ffcddf] w-40 h-16 px-6 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-sm">Department</span>
                  <p className="text-lg font-semibold text-gray-700">
                    {job?.jobDepartment}
                  </p>
                </div> */}

              </div>

              <div className="w-full flex gap-4 py-5">
                <CustomButton
                  onClick={() => setSelected("0")}
                  title="Job Description"
                  containerStyles={`w-full flex items-center justify-center py-3 px-5 outline-none rounded-full text-sm ${
                    selected === "0"
                      ? "bg-black text-white"
                      : "bg-white text-black border border-gray-300"
                  }`}
                />

                <CustomButton
                  onClick={() => setSelected("1")}
                  title="Company"
                  containerStyles={`w-full flex items-center justify-center  py-3 px-5 outline-none rounded-full text-sm ${
                    selected === "1"
                      ? "bg-black text-white"
                      : "bg-white text-black border border-gray-300"
                  }`}
                />
              </div>

              <div className="my-6">
                {selected === "0" ? (
                  <>
                    <p className="text-xl font-semibold dark:text-white">
                      Job Description
                    </p>

                    <span className="text-base dark:text-white">
                      {job?.detail[0]?.desc}
                    </span>

                    {job?.detail[0]?.requirements && (
                      <>
                        <p className="text-xl font-semibold mt-8 dark:text-white">
                          Requirements
                        </p>
                        <span className="text-base dark:text-white">
                          {job?.detail[0]?.requirements}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div className="mb-6 flex flex-col ">
                      <p className="text-xl dark:text-white text-blue-600 font-semibold">
                        {job?.company?.name}
                      </p>
                      <span className="text-base dark:text-white">
                        {job?.company?.location}
                      </span>
                      <span className="text-sm dark:text-white">
                        {job?.company?.email}
                      </span>
                    </div>

                    <p className="text-xl font-semibold dark:text-white">
                      About Company
                    </p>
                    <span className="dark:text-white">
                      {job?.company?.about}
                    </span>
                  </>
                )}
              </div>

              <div className="w-full">
                {user?._id === job?.company?._id ? (
                  <CustomButton
                    title="Delete Post"
                    onClick={handleDeletePost}
                    containerStyles={`w-full flex items-center justify-center text-white bg-red-700 py-3 px-5 outline-none rounded-full text-base`}
                  />
                ) : user?.accountType === "seeker" ? (
                  <Link to={`/apply/${id}`}>
                    <CustomButton
                      title="Apply Now"
                      containerStyles="w-full flex items-center justify-center text-white bg-black py-3 px-5 outline-none rounded-full text-base"
                    />
                  </Link>
                ) : null}
              </div>
            </div>
          )}

          {/* RIGHT SIDE */}
          <div className="w-full md:w-1/3 2xl:w-2/4 p-5 mt-20 md:mt-0">
            <p className="text-gray-500 font-semibold">Similar Job Post</p>

            <div className="w-full flex flex-wrap gap-4">
              {similarJobs?.slice(0, 3).map((job, index) => {
                const data = {
                  name: job?.company.name,
                  logo: job?.company.profileUrl,
                  ...job,
                };
                return <JobCard job={data} key={index} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
