import axios from "axios";
const API_URL = "http://localhost:8800/api-v1";

export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

export const apiRequest = async ({ url, token, data, method }) => {
  try {
    const result = await API(url, {
      method: method,
      data: data,
      headers: {
        "content-type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return result?.data;
  } catch (error) {
    const err = error.response.data;
    console.log(error);
    return { status: err.success, message: err.message };
  }
};

export const handleFileUpload = async (uploadFile) => {
  const formData = new FormData();
  formData.append("file", uploadFile);
  formData.append("upload_preset", "unsigned_preset");

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dhulmnwq6/upload",
      // "https://api.cloudinary.com/v1_1/dh4zizie7/upload",
      formData
    );
    console.log(response);
    return response.data.secure_url;
  } catch (error) {
    if (error.response) {
      console.error('Error response from Cloudinary:', error.response.data);
    } else {
      console.error('Error message:', error.message);
    }
  }
};



export const updateURL = ({
  pageNum,
  query,
  cmpLoc,
  sort,
  navigate,
  location,
  jType,
  exp,
  dept,
}) => {
  const params = new URLSearchParams();

  if (pageNum && pageNum > 1) {
    params.set("page", pageNum);
  }

  if (query) {
    params.set("search", query);
  }

  if (cmpLoc) {
    params.set("location", cmpLoc);
  }

  if (sort) {
    params.set("sort", sort);
  }

  if (jType) {
    params.set("jtype", jType);
  }

  if (exp) {
    params.set("exp", exp);
  }
  if(dept){
    params.set("dept", dept);
  }
  const newURL = `${location.pathname}?${params.toString()}`;
  navigate(newURL, { replace: true });

  return newURL;
};

export const handleCVUpload = async (CV, userId) => {
  // try {
  //   const formData = new FormData();
  //   formData.append("CV", CV);

  //   const res = await axios.post(
  //     `https://workease-server-woad.vercel.app/upload-cv`,
  //     formData,
  //     {
  //       params: { userId },
  //     }
  //   );
  //   return res?.data === "CV uploaded successfully";
  // } catch (error) {
  //   console.log(error);
  //   return error;
  // }

  const formData = new FormData();
  formData.append("CV", CV);

  try {
    const res = await axios.post(`http://localhost:8800/upload-cv/`, formData, {
      params: { userId },
    });
    return res?.data === "CV uploaded successfully";
  } catch (error) {
    console.log(error);
    return false;
  }

   
};
