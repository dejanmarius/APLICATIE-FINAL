import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  CustomButton,
  JobCard,
  JobTypes,
  TextInput,
  Loading,
  JobDepartment,
} from "../components";
import { jobs } from "../utils/data";
import { apiRequest } from "../utils";
import { useSelector } from "react-redux";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { WithContext as ReactTags } from 'react-tag-input';
import JobCardHome from "../components/JobCardHome";
const KeyCodes = {
  comma: 188,
  enter: 13
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const UploadJob = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {},
  });

  const [errMsg, setErrMsg] = useState("");
  const [jobType, setJobType] = useState("Full-Time");
  const [jobDepartment, setJobDepartment] = useState("IT / Telecom");;
  const [isLoading, setIsLoading] = useState(false);
  const [recentPost, setRecentPost] = useState([]);
  const [autoDescription, setAutoDescription] = useState('');
  const [skills, setSkills] = useState([]);
  const handleDelete = (e, index) => {
    e.preventDefault();  // Previne trimiterea formularului
    e.stopPropagation();  // Oprește propagarea evenimentului
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleAddition = skill => {
    setSkills([...skills, skill]);
  };




  function hasLessThan15Words(str) {
    if (!str) return true; // Add this check to prevent errors
    var words = str.trim().split(/\s+/);
    var wordCount = words.length;
    return wordCount < 15;
  }

  function isNotInteger(str) {
    return !/^(\-|\+)?([0-9]+|Infinity)$/.test(str);
  }

  const onSubmit = async (data) => {

    if (data.jobTitle.length < 1) {
      toast.dismiss();
      toast.error("Job Title is required", {
        position: "top-center",
        duration: 3000,
      });

      return;
    }

    if (!isNotInteger(data.jobTitle)) {
      toast.dismiss();
      toast.error("Job Title cannot be integer", {
        position: "top-center",
        duration: 3000,
      });
      return;
    }

    if (parseInt(data.salary) < 30) {
      toast.dismiss();
      toast.error("Minimum Salary is 500 euris", {
        position: "top-center",
        duration: 3000,
      });
      return;
    }

    if (parseInt(data.vacancies) < 1) {
      toast.dismiss();
      toast.error("At least 1 vacancy is required", {
        position: "top-center",
        duration: 3000,
      });
      return;
    }
    if (parseInt(data.experience) < 0) {
      toast.dismiss();
      toast.error("Experience cannot be negative", {
        position: "top-center",
        duration: 3000,
      });

      return;
    }

    if (data.location == "") {
      toast.dismiss();
      toast.error("Location of company/job required", {
        position: "top-center",
        duration: 3000,
      });

      return;
    }
    if (!isNotInteger(data.location)) {
      toast.dismiss();
      toast.error("Location cannot be integer value", {
        position: "top-center",
        duration: 3000,
      });

      return;
    }

    if (hasLessThan15Words(data.desc)) {
      toast.dismiss();
      toast.error("Minimum 15 words for description required", {
        position: "top-center",
        duration: 3000,
      });
      return;
    }






    setIsLoading(true);
    setErrMsg(null);

    const newData = { ...data, jobType: jobType, jobDepartment: jobDepartment, skills: skills.map(skill => skill.text) };

    try {
      const res = await apiRequest({
        url: "/jobs/upload-job",
        token: user?.token,
        data: newData,
        method: "POST",
      });

      if (res.status === "failed") {
        setErrMsg(res.message);  // Modify this line
      } else {
        //setErrMsg({ status: "success", message: res.message });
        toast.success("Job Uploaded", {
          position: "top-center",
          duration: 5000,
        });
        // setTimeout(() => {
        //   navigate("/upload-job");
        //   window.location.reload();
        // }, 300);
        setTimeout(() => {
          window.location.href = "/upload-job";
        }, 3000);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const getRecentPost = async () => {
    try {
      const id = user?._id;

      const res = await apiRequest({
        url: "/companies/get-company/" + id,
        method: "GET",
      });
      setRecentPost(res?.data?.jobPosts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    document.title = "Upload a job";
    getRecentPost();
  }, []);



  return (
    <div className="w-full ">
      <div className="container  mx-auto flex flex-col md:flex-row gap-8 2xl:gap-14 bg-[#f7fdfd] px-3 ">
        <div className="w-full h-fit md:w-2/3 2xl:2/4 bg-white px-5 py-5 md:px-10 shadow-md mt-14">
          <div>
            <p className="text-dark-500 font-semibold text-2xl text-center mx-auto" >
              Job Post
            </p>

            <form
              className="w-full mt-0 flex flex-col gap-4"
              onSubmit={e => {
                e.preventDefault();  // Previne comportamentul implicit al formularului
                handleSubmit(onSubmit)();
              }}
            >
              <TextInput
                name="jobTitle"
                label="Job Title"
                placeholder="eg. Software Engineer"
                type="text"
                required={true}
                register={register("jobTitle", {
                  required: "Job Title is required",
                })}
                error={errors.jobTitle ? (
                  <span className="flex items-center text-red-500 text-xs mt-1">
                    <AiOutlineExclamationCircle className="mr-1" />
                    {errors.jobTitle.message}
                  </span>
                ) : ""}
              />

              <div className="w-full flex gap-4">
                <div className={`w-1/3 mt-2`}>
                  <label className=" text-gray-600 text-sm mb-1">
                    Job Type
                  </label>
                  <JobTypes jobTitle={jobType} setJobTitle={setJobType} />
                </div>

                <div className={`w-1/3 mt-2`}>
                  <label className=" text-gray-600 text-sm mb-1">
                    Department
                  </label>
                  <JobDepartment jobDepartment={jobDepartment} setJobDepartment={setJobDepartment} />
                </div>


                <div className="w-1/3 ">
                  <TextInput
                    name="salary"
                    label="Salary (USD)"
                    placeholder="eg. 1500"
                    type="number"
                    register={register("salary", {
                      required: "Salary is required",
                    })}
                    error={errors.salary ? errors.salary?.message : ""}
                  />
                </div>
              </div>

              <div className="w-full flex gap-4 mb-4">
                <div className="flex flex-col w-1/3">
                  <TextInput
                    name="vacancies"
                    label="No. of Vacancies"
                    placeholder="vacancies"
                    type="number"
                    register={register("vacancies", {
                      required: "Vacancies is required!",
                    })}
                    error={errors.vacancies ? (
                      <span className="flex items-center text-red-500 text-xs mt-1">
                        <AiOutlineExclamationCircle className="mr-1" />
                        {errors.vacancies.message}
                      </span>
                    ) : ""}
                  />
                </div>

                <div className="flex flex-col w-1/3">
                  <TextInput
                    name="experience"
                    label="Years of Experience"
                    placeholder="experience"
                    type="number"
                    register={register("experience", {
                      required: "Experience is required",
                    })}
                    error={errors.experience ? (
                      <span className="flex items-center text-red-500 text-xs mt-1">
                        <AiOutlineExclamationCircle className="mr-1" />
                        {errors.experience.message}
                      </span>
                    ) : ""}
                  />
                </div>

                <div className="flex flex-col w-1/3 ">
                  <TextInput
                    name="location"
                    label="Job Location"
                    placeholder="eg. New York"
                    type="text"
                    register={register("location", {
                      required: "Job Location is required",
                    })}
                    error={errors.location ? (
                      <span className="flex items-center text-red-500 text-xs mt-1">
                        <AiOutlineExclamationCircle className="mr-1" />
                        {errors.location.message}
                      </span>
                    ) : ""}
                  />
                </div>
              </div>

              <div className="flex flex-col mb-4">
                <label className="text-gray-600 text-sm mb-1">Skills</label>
                <div className="flex flex-wrap items-center gap-2 border border-gray-400 p-2 rounded-md">
                  {skills.map((skill, index) => (
                    <div key={index} className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded flex items-center text-sm mr-1">
                      {skill.text}
                      <button onClick={(e) => handleDelete(e, index)} className="ml-1 text-red-500 cursor-pointer">
                        &times;
                      </button>
                    </div>
                  ))}
                  <input
                    type="text"
                    placeholder="Add a skill and press Enter"
                    className="w-full border-none outline-none flex-grow rounded border focus:border-customBlue focus:ring-1 focus:ring-customBlue px-2"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddition({ id: skills.length + 1, text: e.target.value });
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              </div>


              <div className="flex flex-col">
                <label className=" text-gray-600 text-sm mb-1">
                  Job Description
                </label>
                <textarea
                  className="rounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-customBlue text-base px-4 py-2 resize-none"
                  rows={4}
                  cols={6}
                  {...register("desc", {
                    required: "Job Description is required!",
                  })}
                  aria-invalid={errors.desc ? "true" : "false"}
                ></textarea>
                {errors.desc && (
                  <span role="alert" className="text-xs text-red-500 mt-0.5">
                    {errors.desc?.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className=" text-gray-600 text-sm mb-1">
                  Requirements
                </label>
                <textarea
                  className="rounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-customBlue text-base px-4 py-2 resize-none"
                  rows={4}
                  cols={6}
                  {...register("requirements", {
                    required: "Requirements are required!",
                  })}
                  aria-invalid={errors.requirements ? "true" : "false"}

                ></textarea>
                {errors.desc && (
                  <span role="alert" className="text-xs text-red-500 mt-2">
                    {errors.requirements?.message}
                  </span>
                )}
                
              </div>

              
              <div className="mt-2 flex justify-between">
              <button
                  type="button"

                  className="inline-flex justify-center rounded-md border border-transparent bg-customBlue px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
                >
                  Generate Description with AI
                </button>
                {isLoading ? (
                  <Loading />
                ) : (
                  <CustomButton
                    type="submit"
                    containerStyles="inline-flex justify-center rounded-md border border-transparent bg-customBlue px-8 py-2 text-sm font-medium text-white hover:bg-[#1d4fd846] hover:text-[#1d4fd8] focus:outline-none  "
                    title="Submit"
                  />
                )}
              </div>

            </form>
          </div>
        </div>
        <div className="w-full md:w-1/3 p-5 mt-20 md:mt-0 ">

          <p className="text-gray-500 font-semibold dark:text-white ">
            Recent Posts
          </p>

          <div className="w-full flex flex-wrap  gap-5 mt-3">
            {recentPost.slice(0, 3).map((job, index) => {
              const data = {
                name: user?.name,
                email: user?.email,
                logo: user?.profileUrl,
                ...job,
              };
              return <JobCardHome job={data} key={index} />;
            })}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default UploadJob;
