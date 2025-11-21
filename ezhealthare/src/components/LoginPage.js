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

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
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
      let response;
      const { username, password } = formData;

      if (username.trim() === "admin") {
        response = await axios.post("http://localhost:8080/auth/admin-login", {
          username,
          password,
        });
      } else {
        response = await axios.post("http://localhost:8080/auth/user-login", {
          username,
          password,
        });
      }

      if (response.data.token && response.data.userId !== undefined) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        console.log("Login successful:", response.data);

        // Redirect based on user type
        if (username.trim() === "admin" || response.data.userId === -1) {
          navigate("/adminDashboard"); // Admin goes to adminDashboard
        } else {
          navigate("/Userdashboard"); // Regular users go to Userdashboard
        }
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setError(error.response?.data || "Invalid login credentials. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(to right,rgb(169, 199, 223),rgb(29, 66, 92))",
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
            className="flex flex-col px-8 mt-[40px]"
            style={{
              width: "400px",
              height: "100%",
              borderRadius: "68px 0 0 68px",
              marginLeft: "320px",
            }}
          >
            <h2 className="text-[25px] font-[700] text-black font-['Cabin'] text-left mb-[30px]">
              Welcome Back
            </h2>
            <form className="space-y-10" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  id="username"
                  placeholder="Username"
                  onChange={handleChange}
                  value={formData.username}
                  className="w-full border-b border-gray-300 focus:outline-none focus:border-black bg-transparent text-[#827979] text-[22px] font-[400] font-['Cabin'] placeholder-[#827979]"
                />
              </div>
              <div>
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  onChange={handleChange}
                  value={formData.password}
                  className="w-full border-b border-gray-300 focus:outline-none focus:border-black bg-transparent text-[#827979] text-[22px] font-[400] mb-[10px] font-['Cabin'] placeholder-[#827979]"
                />
                {error && <p className="text-red-500 text-center">{error}</p>}
              </div>
              <div className="text-center">
                {/* <a
                  href="#"
                  className="text-[18px] leading-[60px] mt-[0px] text-black font-[400] font-['Cabin'] hover:underline"
                >
                  Forgot Your Password?
                </a> */}
              </div>
              <button
                type="submit"
                className="w-[320px] h-[50px] bg-[#5F94CD] text-white px-4 rounded-[15px] font-[400] text-[20px] mt-[0px] font-['Cabin'] mx-auto block hover:bg-blue-600 transition duration-200"
              >
                Log in
              </button>
            </form>
            <p className="leading-[60px] text-center text-[18px] text-[#4B4747] font-[400] font-['Cabin']">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-[#5F94CD] hover:underline">
                Signup
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;