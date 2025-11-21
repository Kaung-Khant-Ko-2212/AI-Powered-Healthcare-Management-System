import React, { useEffect } from 'react';
import './ServicesPage.css';
import { Link } from 'react-router-dom';


function Services() {
  useEffect(() => {
    const serviceCards = document.querySelectorAll('.service-card1');
    serviceCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('visible');
      }, index * 100); // Stagger the appearance
    });
  }, []);

  return (
    <div className="services-page">
      <header className="services-header">
        
      </header>
      <div className="services-container1">
        <div className="service-card1">
          <img src="images/robot.png" alt="AI Medical Summary" className="service-image1" />
          <div className="service-content1">
            <h2  style={{textAlign:"left"}}>AI Medical Summary</h2>
            <p>Get quick and accurate medical insights with our AI-powered chatbot. Upload your checkup results, and let our AI summarize and explain them for you in simple terms</p>
            <Link to="/chatbot" style={{textDecoration:"none"}}>
            <button className="service-button1">Summarize My Results</button>
            </Link>
            
          </div>
        </div>

        <div className="service-card1">
          <img src="images/hospital.png" alt="Find Your Nearest Hospital" className="service-image1" />
          <div className="service-content1">
            <h2 style={{textAlign:"left"}}>Find Hospital Location</h2>
            <p>Locate hospitals quickly and easily. Our tool helps you find top-rated hospitals for immediate care and convenience.</p>
            
            <Link to="/map" style={{textDecoration:"none"}}>
            <button className="service-button2">Find Hospitals</button>
            </Link>
          </div>
        </div>

        <div className="service-card1">
          <img src="images/doctor.png" alt="Book Your Appointment" className="service-image1" />
          <div className="service-content1">
            <h2 style={{textAlign:"left"}}>Book Your Appointment</h2>
            <p>Book your appointments with top doctors at your convenience. Choose your preferred date, time, and specialist in just a few clicks</p>
            <Link to="/specialists" style={{textDecoration:"none"}}>
            <button className="service-button4">Book Now</button>
            </Link>
          </div>
        </div>

        <div className="service-card1">
          <img src="images/food.png" alt="Calculate Your Daily Calories" className="service-image1" />
          <div className="service-content1">
            <h2 style={{textAlign:"left"}}>Calculate Your Daily Calories</h2>
            <p>Estimate your daily calorie intake easily. Our tool helps you manage your health goals by providing accurate calorie recommendations based on your preferences.</p>
            
            <Link to="/food-categories" style={{textDecoration:"none"}}>
            <button className="service-button4">Calculate Now</button>
            </Link>
            
          </div>
        </div>
      </div>

      {/* Footer Section */}
      
    </div>
  );
}

export default Services;
