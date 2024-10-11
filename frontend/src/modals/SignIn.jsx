/* eslint-disable no-useless-escape */
/* eslint-disable react/no-unescaped-entities */
// /* eslint-disable react/no-unescaped-entities */

import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { RxCross1 } from "react-icons/rx";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import { useNavigate } from "react-router-dom";
import SignUp from "./SignUp";
import DotSpinner from "../components/DotSpinner";

const SignIn = ({ setSelectedItem }) => {
  const navigate = useNavigate();
  const [loggingIn, setLoggingIn] = useState(false);
  const { signIn } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoggingIn(true);
      await signIn(data);
      reset();
      setLoggingIn(false);
      navigate("/");
      setSelectedItem(null);
    } catch (error) {
      setLoggingIn(false);
      console.log("Error signing in:", error);
    }
  };

  // useEffect(() => {
  //   if (user) {
  //     navigate("/");
  //     setSelectedItem(null);
  //   }
  // }, [user, navigate, setSelectedItem]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
      <main className="w-full h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white shadow-2xl py-6 p-6 rounded-lg text-gray-600 space-y-5">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
              Sign in
            </h3>
            <button
              className=" p-2 rounded-full shadow-sm hover:shadow-lg active:bg-slate-300 hover:bg-[#F2F2F2]  cursor-pointer"
              onClick={() => setSelectedItem(null)}>
              <RxCross1
                size={"24px"}
                className={`${loggingIn ? " cursor-not-allowed" : ""}`}
              />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email */}
            <div className="flex-1 pb-1">
              <label className="block text-gray-700 font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border ${
                  errors.email ? "border-red-500" : "border-slate-200"
                } rounded-md px-3 py-2 focus:outline-none transition duration-300 ease focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow`}
                placeholder="Email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm pt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex-1 pb-1 pt-2">
              <label className="block text-gray-700 font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
                className={`w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border ${
                  errors.password ? "border-red-500" : "border-slate-200"
                } rounded-md px-3 py-2 focus:outline-none transition duration-300 ease focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow`}
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm pt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <p className="flex justify-end items-center">
              <a className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                Forgot password
              </a>
            </p>

            {/* Submit Button */}
            <div className="text-left mt-6">
              <button
                className={`w-full select-none rounded-lg bg-gray-900 py-3 px-6 text-xs font-bold uppercase text-white shadow-md hover:shadow-lg transition-all ${
                  loggingIn ? " cursor-not-allowed" : ""
                }`}
                type="submit"
                disabled={loggingIn}>
                {loggingIn ? (
                  <span className="flex items-center gap-2 justify-center">
                    <DotSpinner />
                    Logging...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>

          <button className="w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50 duration-150 active:bg-gray-100">
            <img className="w-5" src="/icons8-google.svg" alt="Google icon" />
            Continue with Google
          </button>

          <p className="text-center">
            Don't have an account?{" "}
            <a
              onClick={() => setSelectedItem(<SignUp />)}
              className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
              Sign up
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignIn;
