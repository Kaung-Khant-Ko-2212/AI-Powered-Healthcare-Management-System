import React from 'react';
import './Footer.css';
import { HiArrowRight } from 'react-icons/hi';
import { FaLinkedin, FaFacebookF, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer4">
      <div className="footer-content">
        <div className="footer-left">
          <h1>EZ HEALTHCARE</h1>
          <p>Leading the Way in Medical Excellence, Trusted Care.</p>
        </div>

        <div className="footer-section">
          <h3 style={{color: '#FFFFFF'}}>Important Links</h3>
          <ul>
            <li><a href="/appointment">Appointment</a></li>
            <li><a href="/doctors">Doctors</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/about">About Us</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 style={{color: '#FFFFFF'}}>Contact Us</h3>
          <p>Call: 09 967709194</p>
          <p>Email: susu@gmail.com</p>
          <p>Address: 23 blah blah</p>
          <p>Myanmar</p>
        </div>

        <div className="footer-section">
          <h3 style={{color: '#FFFFFF'}}>Newsletter</h3>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email address" />
            <button type="submit">
              <HiArrowRight />
            </button>
          </div>
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        <p> 2025 EZ Healthcare All Rights Reserved by EZ team</p>
        <div className="social-links">
          <a href="#" aria-label="LinkedIn">
            <FaLinkedin />
          </a>
          <a href="#" aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a href="#" aria-label="Instagram">
            <FaInstagram />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;