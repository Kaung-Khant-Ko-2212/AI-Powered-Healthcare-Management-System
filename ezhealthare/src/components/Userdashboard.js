import React from 'react';
import './Homepage.css'; // Assuming CSS is extracted into a separate file
import { Link } from 'react-router-dom';
import Usernavbar from './Usernavbar';
import Services from './Services';
import Footer from './Footer';

const Homepage = () => {
    return (
        <div className="home-page">
            {/* Navbar */}
            <Usernavbar />

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
            <Services />

            {/* Our Specialized Doctors Section */}
            {/* <div className="specialized-doctors">
                
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1200px',paddingBottom:"30px" }}>
                <h2 style={{ margin: 'auto',paddingLeft:"250px" }}>Our Specialized Doctors</h2>
                <a href="#" className="see-all" style={{ marginLeft: 'auto',paddingTop:"20px" }}>See All &rarr;</a>
            </div>
                <div className="doctor-container">
                    {[
                        { image: 'doctor1.jpg', name: 'Dr. Ye Khant Kyaw', specialization: 'Neurology (M.B.B.S)' },
                        { image: 'doctor2.jpg', name: 'Dr. Ye Ye', specialization: 'Cardiology (M.D.)' },
                        { image: 'doctor3.jpg', name: 'Dr. Minn Thu Mon', specialization: 'Orthopedics (M.S.)' },
                        { image: 'doctor4.jpg', name: 'Dr. Ye Min Lwin Oo', specialization: 'Dermatology (M.D.)' },
                        { image: 'doctor5.jpg', name: 'Dr. Sarah Lee', specialization: 'Pediatrics (M.B.B.S)' },
                        { image: 'doctor5.jpg', name: 'Dr. David Miller', specialization: 'General Surgery (M.S.)' }
                    ].map((doctor, index) => (
                        <div className="doctor-card" key={index}>
                            <img 
                                src={`images/${doctor.image}`} 
                                alt={`Dr. ${doctor.name}`} 
                                style={{  display: 'block', margin: '0 auto', objectFit: 'cover', borderRadius: '50%'}}
                            />
                            <h3>{doctor.name}</h3>
                            <p>{doctor.specialization}</p>
                        </div>
                    ))}
                </div>
            </div> */}



            

            {/* FAQ Section */}
            <div className="faq-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1200px',paddingBottom:"30px" }}>
                <h2 style={{ margin: 'auto',paddingLeft:"250px" }}>Frequently Asked Questions</h2>
                <a href="userfaq" className="see-all" style={{ marginLeft: 'auto',paddingTop:"20px" }}>See All &rarr;</a>
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
                            { question: "Is the system compliant with healthcare regulations?", answer: "Absolutely. Our system adheres to all local and international healthcare standards and regulations." }
                        ].map((faq, index) => (
                            <div className="faq-item" key={index}>
                                <div className="faq-question">{faq.question}<span className="toggle-icon">+</span></div>
                                <div className="faq-answer hidden">{faq.answer}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Homepage;