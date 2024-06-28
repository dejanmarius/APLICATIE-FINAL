import React, { useState } from "react";
const theme = localStorage.getItem("theme");
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
const TextInput = React.forwardRef(
  ({ type, placeholder, styles, label, register, name, error }, ref) => {


    return (
      <div className="flex flex-col mt-2">
        <p
          className={`
           text-gray-600 text-sm mb-1 
         `}
        >
          {label}
        </p>

        <input
          type={type}
          name={name}
          placeholder={placeholder}
          ref={ref}
          className={`rounded border border-gray-400 focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue text-base px-4 py-2 ${styles}`}
          {...register}
          aria-invalid={error ? "true" : "false"}
        />


        {error && <span className="text-xs text-red-500 mt-0.5 ">{error}</span>}
      </div>
    );
  }
);

export default TextInput;
