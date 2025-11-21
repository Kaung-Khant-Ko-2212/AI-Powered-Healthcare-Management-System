import { motion } from "framer-motion";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const pageVariants = {
  initial: { opacity: 0, x: "-30vw" },
  animate: { opacity: 1, x: 0, transition: { duration: 1.5, ease: "backOut" } },
  exit: { opacity: 0, x: "30vw", transition: { duration: 1.2, ease: "anticipate" } },
};

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    age: "",
    gender: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail\.com|uit\.edu\.mm|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    // Email validation
    if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format. Use @gmail.com or @uit.edu.mm.";
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/auth/register", formData);
      console.log("Signup successful:", response.data);
      navigate("/login");
  } catch (error) {
      console.error("Error registering user:", error.response?.data || error.message);
      if (error.response?.data?.includes("Username is already taken")) { // Check for the specific message
          setErrors({ username: error.response.data }); // Set the error for the username field
      } else {
          setErrors({ api: error.response?.data || "Registration failed! Please try again." }); // General error
      }
  }
  };


  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        // backgroundColor: "#EAF8FF",  // Full background color
        background: "linear-gradient(to right,rgb(169, 199, 223),rgb(29, 66, 92))",  // Full background color
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
            margin:"auto",
          }}
        >
          
          <div
            className="flex flex-col px-8"
            style={{
              width: "400px",
              height: "100%",
              borderRadius: "68px 0 0 68px",
              marginLeft: "320px", // Added margin-left
            }}
          >
            
              <h2 className="text-[25px] font-[700] text-black font-['Cabin'] text-left mb-[20px]">Create Your Account</h2>
              <form className="space-y-6"  onSubmit={handleSubmit}>
                <div>
                  <input
                    type="text"
                    id="fullName"
                    placeholder="Full Name"
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 focus:outline-none focus:border-black bg-transparent text-[#827979] text-[18px] font-[400] font-['Cabin'] placeholder-[#827979]"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    id="username"
                    placeholder="Username"
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 focus:outline-none focus:border-black bg-transparent text-[#827979] text-[18px] font-[400] font-['Cabin'] placeholder-[#827979]"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 focus:outline-none focus:border-black bg-transparent text-[#827979] text-[18px] font-[400] font-['Cabin'] placeholder-[#827979]"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 focus:outline-none focus:border-black bg-transparent text-[#827979] text-[18px] font-[400] font-['Cabin'] placeholder-[#827979]"
                  />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>
                <div>
                  <input
                    type="number"
                    id="age"
                    placeholder="Age"
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 focus:outline-none focus:border-black bg-transparent text-[#827979] text-[18px] font-[400] font-['Cabin'] placeholder-[#827979]"
                  />
                </div>
                <div>
                  <select
                    id="gender"
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 focus:outline-none focus:border-black bg-transparent text-[#827979] text-[18px] font-[400] font-['Cabin']"
                  >
                    <option value="" disabled selected hidden>Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.api && <p className="text-red-500 text-sm">{errors.api}</p>}
                </div>

                {/* <Link to="/adminDashboard" style={{ textDecoration: 'none' }}> */}
                <button
                  type="submit"
                  className="w-[320px] mt-10 h-[50px] bg-[#5F94CD] text-white py-2 px-4 rounded-[15px] font-[400] text-[20px] font-['Cabin'] mx-auto block hover:bg-blue-600 transition duration-200"
                >
                  Create Account
                </button>
                {/* </Link> */}
              </form>
            <p className=" text-center leading-[60px] text-[18px] text-[#4B4747] font-[400] font-['Cabin']">
              Already have an account?{' '}
              <Link to="/login" className="text-[#5F94CD] hover:underline">
              Log in
              </Link>
            </p>            
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
