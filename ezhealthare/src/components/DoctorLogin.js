/* eslint-disable jsx-a11y/anchor-is-valid */
import { motion } from "framer-motion";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const pageVariants = {
  initial: { opacity: 0, x: "-30vw" },
  animate: { opacity: 1, x: 0, transition: { duration: 1.5, ease: "backOut" } },
  exit: { opacity: 0, x: "30vw", transition: { duration: 1.2, ease: "anticipate" } },
};

const DoctorLoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/doctor-login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.data.token && response.data.doctorId) {
        // Store token and doctorId in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("doctorId", response.data.doctorId);

        console.log("Login successful:", response.data);
        navigate("/doctorDashboard");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      // If the error response contains a 'message' property, use it
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (typeof error.response?.data === "object") {
        // Otherwise, convert the object to a string for debugging purposes
        setError(JSON.stringify(error.response.data));
      } else {
        setError("Invalid login credentials. Please try again.");
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background:
          "linear-gradient(to right, rgb(169, 199, 223), rgb(29, 66, 92))",
        width: "100%",
      }}
    >
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="container mx-auto p-6"
      >
        <div
          className="p-8 bg-white bg-opacity-80 rounded-lg shadow-lg"
          style={{
            width: "804px",
            height: "576px",
            borderRadius: "68px",
            backgroundImage: "url('images/Signup.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            alignItems: "center",
            margin: "auto",
          }}
        >
          <div
            className="flex flex-col px-8"
            style={{
              width: "400px",
              height: "100%",
              borderRadius: "68px 0 0 68px",
              marginLeft: "320px",
            }}
          >
            <h2
              className="text-[25px] font-[700] text-black font-['Cabin'] text-left mt-[80px] mb-[30px]"
            >
              Welcome Back Doctor
            </h2>
            <form className="space-y-10" onSubmit={handleSubmit}>
              <div>
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 focus:outline-none focus:border-black bg-transparent text-[#827979] text-[22px] font-[400] my-[20px] font-['Cabin'] placeholder-[#827979]"
                />
              </div>
              <div>
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 focus:outline-none focus:border-black bg-transparent text-[#827979] text-[22px] font-[400] my-[20px] font-['Cabin'] placeholder-[#827979]"
                />
                {error && (
                  <p className="text-red-500 text-center">
                    {error}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-[320px] h-[50px] bg-[#5F94CD] text-white px-4 rounded-[15px] font-[400] text-[20px] mt-[0px] font-['Cabin'] mx-auto block hover:bg-blue-600 transition duration-200"
              >
                Log in
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DoctorLoginPage;
