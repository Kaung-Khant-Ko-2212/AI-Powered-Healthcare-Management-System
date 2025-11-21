import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import axios from "axios";

import Navbar from "./components/Navbar";
import ProfilePage from "./components/ProfilePage";
import ProfileEditPage from "./components/ProfileEditPage";
import FoodCategories from "./components/FoodCategories";
import FoodList from "./components/FoodList";
import MapComponent from "./components/MapComponent";
import HomePage from "./components/Homepage";
import Services from "./components/Services";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import AboutUs from "./components/AboutUs";
import FAQ from "./components/FAQ";
import SpecialistsPage from "./components/SpecialistsPage";
import YourAppointment from "./components/YourAppointment";
import DoctorInfo from "./components/DoctorInfo";
import PatientViewPage from "./doctor/PatientViewPage";
import DoctorDashboard from "./doctor/DoctorDashboard";
import AppointmentViewPage from "./doctor/AppointmentViewPage";
import CancelSchedule from "./doctor/CancelSchedule";
import Dashboard from "./pages/Dashboard";
import CreateNewDoctor from "./pages/CreateNewDoctor";
import Article from "./admins/Article";
import ArticlePage from "./components/ArticlePage";
import DoctorList from "./admins/DoctorList";
import DoctorRequests from "./admins/DoctorRequests";
import AdminPatientList from "./admins/AdminPatientList";
import ConfirmAppointment from "./admins/ConfirmAppointment";
import Userdashboard from "./components/Userdashboard";
import UserAboutus from "./components/UserAboutus";
import UserFaq from "./components/UserFaq";
import ChatBot from "./components/ChatBot";
import DoctorLoginPage from "./components/DoctorLogin";
import "./App.css";
import ArticleDetail from "./components/ArticleDetail";
import ArticleList from "./admins/ArticleList";

function AnimatedRoutes({ isEditing, handleEditClick, handleCancelClick, selectedItems, setSelectedItems, hospitals }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* General Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/profile/:userId/edit" element={<ProfileEditPage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/specialists" element={<SpecialistsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/article-user" element={<ArticlePage />} />
        <Route path="/your-appointments" element={<YourAppointment />} />
        <Route path="/doctor/:doctorId" element={<DoctorInfo />} />
        <Route path="/PatientViewPage" element={<PatientViewPage />} />
        <Route path="/doctorDashboard" element={<DoctorDashboard />} />
        <Route path="/appointments" element={<AppointmentViewPage />} />
        <Route path="/patients" element={<PatientViewPage />} />
        <Route path="/schedule" element={<CancelSchedule />} />
        <Route path="/doctorlogin" element={<DoctorLoginPage />} />

        {/* Admin Routes */}
        <Route path="/adminDashboard" element={<Dashboard />} />
        <Route path="/create-new-doctor" element={<CreateNewDoctor />} />
        <Route path="/add-new-article" element={<Article />} />
        <Route path="/doctor-list" element={<DoctorList />} />
        <Route path="/doctors-requests" element={<DoctorRequests />} />
        <Route path="/ConfirmAppointment" element={<ConfirmAppointment />} />
        <Route path="/adminPatient" element={<AdminPatientList />} />
        <Route path="/article-list" element={<ArticleList />} />
        
        <Route path="/chatbot" element={<ChatBot />} />
        {/* Food & Map Routes */}
        <Route
          path="/food-categories"
          element={
            <FoodCategories
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          }
        />
        {/* Remove standalone /food-list route since FoodList is rendered within FoodCategories */}
        <Route path="/map" element={<MapComponent hospitals={hospitals} />} />

        <Route path="/Userdashboard" element={<Userdashboard />} />
        <Route path="/useraboutus" element={<UserAboutus />} />
        <Route path="/userfaq" element={<UserFaq />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [isEditing, setIsEditing] = useState(false);
  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => setIsEditing(false);

  const [selectedItems, setSelectedItems] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [id, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8080/api/auth/users/${id}`) // Corrected to use .get()
        .then((res) => {
          setUserId(res.data); // Assuming res.data contains user data
        })
        .catch((err) => console.error("Error fetching user:", err));
    }
  }, [id]);

  return (
    <Router>
      <div className="App">
        <AnimatedRoutes
          isEditing={isEditing}
          handleEditClick={handleEditClick}
          handleCancelClick={handleCancelClick}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          hospitals={hospitals}
        />
      </div>
    </Router>
  );
}

export default App;