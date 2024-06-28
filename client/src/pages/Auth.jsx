import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { SignUp } from "../components";
import "animate.css";
import { pictue } from "../assets";

const Auth = () => {
  const { user } = useSelector((state) => state.user);
  const [open, setOpen] = useState(true);
  const location = useLocation();

  let from = location?.state?.from?.pathname || "/";

  if (user.token) {
    return window.location.replace(from);
  }

  useEffect(() => {
    document.title = "LogIn/SignUp";
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <img
        src={pictue}
        alt="Office"
        className=" object-cover w-full h-full"
      />
      <div className="absolute w-full flex justify-center items-center">
        <SignUp open={open} setOpen={setOpen} />
      </div>
    </div>
  );
};

export default Auth;
