import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './Homepage.css'; // Assuming CSS is extracted into a separate file
import axios from 'axios'; // Import axios for API calls

const Homepage = () => {
  const [articles, setArticles] = useState([]); // State to hold articles from the database
  const [loading, setLoading] = useState(true); // State to handle loading

  // Fetch articles from the backend
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/article/all', {
          headers: {
            // Optionally include Authorization header if your backend requires authentication
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log('Fetched articles:', response.data); // Debug: Log the raw data to verify structure
        // Limit to 3 articles for display (adjust as needed)
        setArticles(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching articles:', error);
        setArticles([]); // Fallback to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Function to get image URL, enhanced for better error handling
  const getImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl === 'undefined' || imageUrl === null) {
      console.warn('Invalid imageUrl field, using default:', imageUrl);
      return '/images/default-article.jpg'; // Ensure this file exists in public/images/
    }
    return `http://localhost:8080/api/article/image/${imageUrl}`;
  };

  return (
    <div className="home-page">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="hero" style={{ marginTop: '60px' }}>
        <div className="text-content">
          <h1>Your Health,</h1>
          <h2>Your Priority</h2>
          <p>Manage Your Health with our AI-powered services</p>
        </div>
        <img src="images/doctors.png" alt="Doctors" />
      </div>

      {/* Services Section */}
      <div className="services">
        <div className="service-title1">Our Services</div>
        <div className="services-container">
          <div className="service-card">
            <img src="images/chatbot.jpg" alt="Chatbot" />
            <h3>Medical Checkup Summarization Chatbot</h3>
            <p>Get an AI-powered summary of your medical checkup results for easy understanding.</p>
          </div>
          <div className="service-card">
            <img src="images/appointment.png" alt="Appointment" />
            <h3>Make an Appointment</h3>
            <p>Book an appointment with our certified doctors in just a few clicks.</p>
          </div>
          <div className="service-card">
            <img src="images/hospital.jpg" alt="Hospital" />
            <h3>Find Your Nearest Hospital</h3>
            <p>Locate the nearest hospitals quickly and easily. Find top-rated hospitals for immediate care.</p>
          </div>
          <div className="service-card">
            <img src="images/calories.png" alt="Calories" />
            <h3>Calculate Your Calories</h3>
            <p>Easily calculate the calories you consume and burn to maintain your health goals.</p>
          </div>
        </div>
      </div>

      {/* Our Specialized Doctors Section */}
      {/* <div className="specialized-doctors">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1200px', paddingBottom: "30px" }}>
          <h2 style={{ margin: 'auto', paddingLeft: "250px" }}>Our Specialized Doctors</h2>
          <a href="login" className="see-all" style={{ marginLeft: 'auto', paddingTop: "20px" }}>See All →</a>
        </div>
        <div className="doctor-container">
          {[
            { image: 'doctor1.jpg', name: 'Dr. Ye Khant Kyaw', specialization: 'Neurology (M.B.B.S)' },
            { image: 'doctor2.jpg', name: 'Dr. Ye Ye', specialization: 'Cardiology (M.D.)' },
            { image: 'doctor3.jpg', name: 'Dr. Minn Thu Mon', specialization: 'Orthopedics (M.S.)' },
            { image: 'doctor4.jpg', name: 'Dr. Ye Min Lwin Oo', specialization: 'Dermatology (M.D.)' },
            { image: 'doctor5.jpg', name: 'Dr. Sarah Lee', specialization: 'Pediatrics (M.B.B.S)' },
            { image: 'doctor5.jpg', name: 'Dr. David Miller', specialization: 'General Surgery (M.S.)' },
          ].map((doctor, index) => (
            <div className="doctor-card" key={index}>
              <img
                src={`images/${doctor.image}`}
                alt={`Dr. ${doctor.name}`}
                style={{ display: 'block', margin: '0 auto', objectFit: 'cover', borderRadius: '50%' }}
              />
              <h3>{doctor.name}</h3>
              <p>{doctor.specialization}</p>
            </div>
          ))}
        </div>
      </div> */}

      {/* Our Recent Articles Section */}
      <div className="recent-articles">
        <div className="articles-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1200px', paddingBottom: "30px" }}>
          <h2 style={{ margin: 'auto', paddingLeft: "250px" }}>Our Recent Articles</h2>
          <a href="login" className="see-all" style={{ marginLeft: 'auto', paddingTop: "20px" }}>See All →</a>
        </div>

        <div className="article-container2">
          {loading ? (
            <p>Loading articles...</p>
          ) : articles.length > 0 ? (
            articles.map((article, index) => (
              <div className="article-card" key={article.id}>
                <img
                  src={getImageUrl(article.imageUrl)} // Changed to article.imageUrl to match ArticlePage
                  alt={article.title}
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = '/images/default-article.jpg'; // Fallback image
                    console.warn(`Failed to load image for article ${article.title}, using default`);
                  }}
                />
                <h3>{article.title}</h3>
                <p>
                  {article.content && article.content.length > 100
                    ? `${article.content.substring(0, 100)}...`
                    : article.content || 'No content available'}
                </p>
              </div>
            ))
          ) : (
            <p>No recent articles available.</p>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1200px', paddingBottom: "30px" }}>
          <h2 style={{ margin: 'auto', paddingLeft: "250px" }}>Frequently Asked Questions</h2>
          <a href="FAQ" className="see-all" style={{ marginLeft: 'auto', paddingTop: "20px" }}>See All →</a>
        </div>
        <div className="faq-container">
          {/* Left half: Image */}
          <div className="faq-image">
            <img src="images/faq-icon.png" alt="FAQ Icon" />
          </div>

          {/* Right half: FAQ Questions */}
          <div className="faq-questions">
            {[
              { question: "What is the purpose of the Healthcare Management System?", answer: "Our system is designed to streamline patient care, manage medical records, schedule appointments, and facilitate communication between patients and healthcare providers." },
              { question: "How do I register as a patient?", answer: "Registration is simple. Click on the \"Register\" button on our homepage and fill out the required details." },
              { question: "Can I book appointments online?", answer: "Yes, our system allows you to book appointments with your preferred doctor at your convenience." },
              { question: "Is the system compliant with healthcare regulations?", answer: "Absolutely. Our system adheres to all local and international healthcare standards and regulations." },
            ].map((faq, index) => (
              <div className="faq-item" key={index}>
                <div className="faq-question">{faq.question}<span className="toggle-icon">+</span></div>
                <div className="faq-answer hidden">{faq.answer}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Homepage;