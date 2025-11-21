import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
const AboutUs = () => {
  return (
    <div>
      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <div
        className="w-full h-[714px] bg-cover bg-center font-inter flex items-center"
        style={{ backgroundImage: "url('images/AU1.png')" }}
      >
        <div className="w-[50%] px-8 md:px-12 text-white">
          <h1 className="text-[40px] font-bold mb-[40px] leading-[60.51px] text-justify">
            AI-Powered Innovation for Modern Healthcare
          </h1>
          <h3 className="text-[20px] font-medium leading-[32.68px] text-justify text-white">
            Our healthcare management system was born out of a vision to transform how healthcare is delivered and managed worldwide. Combining cutting-edge artificial intelligence with state-of-the-art technology, we’ve designed a platform that brings precision, efficiency, and ease to healthcare professionals and patients alike.
          </h3>
        </div>
      </div>

      {/* About Section */}
      <div className="w-full font-inter flex">
        <div className="px-8 md:px-12">
          <h1
            className="text-[40px] font-medium mt-[60px] leading-[53.25px] text-justify"
            style={{
              position: 'relative',
              paddingBottom: '10px', // Adjust to space the text from the gradient
            }}
          >
            Who we are
            <span
              style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '75%',
                height: '4px',
                background: 'linear-gradient(to right, #0F4C8D 0%, #FFFEFE 100%)',
              }}
            />
          </h1>
          <p className="text-[20px] mt-[20px] leading-[30.26px] text-justify" style={{ color: '#454343' }}>
            At the heart of healthcare and technology, we are a team of innovators, problem-solvers, and healthcare enthusiasts dedicated to reshaping the future of medical management. Our mission is to bridge the gap between cutting-edge technology and compassionate care through our AI-powered healthcare management system.
          </p>

          <div style={{ display: 'flex', marginTop: '0px' }}>
            {/* Left side: Image */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
              <img
                src="images/Aboutus2.png" // Replace with your image path
                alt="Healthcare"
                style={{ width: '100%', height: 'auto', maxWidth: '600px' }}
              />
            </div>

            {/* Right side: Text */}
            <div style={{ flex: '0 0 45%' }}>
              <h1
                className="text-[30px] font-medium leading-[53.25px] text-justify"
                style={{
                  position: 'relative',
                  paddingBottom: '10px',
                  paddingLeft: '20px',
                  // Adjust to space the text from the gradient
                }}
              >
                Redefining Healthcare Management
              </h1>
              <p className="text-[20px] leading-[30.26px] text-justify" style={{ color: '#454343',paddingLeft: '20px' }}>
                We believe in empowering hospitals, clinics, and healthcare professionals with intelligent tools to simplify processes, enhance efficiency, and improve patient outcomes. By integrating advanced artificial intelligence, modern software architecture, and a deep understanding of healthcare challenges, we’ve created a platform that puts users first—whether they are doctors, patients, or administrators.
              </p>
              <p className="text-[20px] leading-[30.26px] text-justify" style={{ color: '#454343',paddingLeft: '20px' }}>
                Our commitment goes beyond technology. We’re passionate about making healthcare more efficient and accessible to everyone.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How We Created EZ Healthcare */}
      <div className="w-full font-inter flex">
        <div className="px-8 md:px-12">
          <h1
            className="text-[40px] font-medium mt-[60px] leading-[53.25px] text-justify"
            style={{
              position: 'relative',
              paddingBottom: '10px', // Adjust to space the text from the gradient
            }}
          >
            How we created EZ Healthcare
            <span
              style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '75%',
                height: '4px',
                background: 'linear-gradient(to right, #0F4C8D 0%, #FFFEFE 100%)',
              }}
            />
          </h1>
          <p className="text-[20px] mt-[20px] leading-[30.26px] text-justify" style={{ color: '#454343' }}>
            We created our AI-powered healthcare system by combining cutting-edge technology, real-world research, and user-focused design to simplify processes, enhance efficiency, and improve patient care for healthcare professionals worldwide.
          </p>
          <div style={{ display: 'flex', marginTop: '0px' }}>
            {/* Left side: Text */}
            <div style={{ flex: '0 0 55%', paddingRight: '20px' }}>
            <h1
                className="text-[30px] font-medium leading-[53.25px] text-justify"
                style={{
                  position: 'relative',
                  paddingBottom: '30px', // Adjust to space the text from the gradient
                }}
              >
                Our Background
              </h1>
              <div className="text-[20px] leading-[30.26px] text-justify" style={{ color: '#454343' }}>
                At the heart of healthcare and technology, we are a team of innovators, problem-solvers, and healthcare enthusiasts dedicated to reshaping the future of medical management. Our mission is to bridge the gap between cutting-edge technology and compassionate care through our AI-powered healthcare management system.
              </div>
                           
            </div>

            {/* Right side: Image */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <img
                src="images/Aboutus3.png" // Replace with your image path
                alt="Healthcare"
                style={{ width: '100%', height: 'auto', maxWidth: '368px' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', marginTop: '120px' }}>
            {/* Left side: Image */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
              <img
                src="images/Aboutus4.png" // Replace with your image path
                alt="Healthcare"
                style={{ width: '100%', height: 'auto', maxWidth: '544px' }}
              />
            </div>

            {/* Right side: Text */}
            <div style={{ flex: '0 0 55%' , marginTop: '50px' }}>
              <h1
                className="text-[30px] font-medium leading-[53.25px] text-justify"
                style={{
                  position: 'relative',
                  paddingBottom: '30px',
                  paddingLeft:"40px",
                  
                   // Adjust to space the text from the gradient
                }}
              >
                We learned from industry professionals
              </h1>
              <div className="text-[20px] leading-[30.26px] text-justify" style={{ color: '#454343',paddingLeft:'40px' }}>
                To perfect , we collaborated with over 1,000 healthcare professionals, including doctors, administrators, nurses, and clinic managers from Africa, Europe, Asia, and the Americas. By understanding their daily operations and challenges, we built a solution that addresses real-world needs. Our system elevates healthcare with unmatched convenience and reliability, tailored to enhance the efficiency of clinics and hospitals worldwide.
              </div>
            </div>
          </div>
        </div>        
      </div>
      <div className="px-8 md:px-12">
        <h1
            className="text-[44px] font-medium my-[100px] leading-[53.25px] text-justify"
            style={{
            position: 'relative',
            paddingBottom: '10px', // Adjust to space the text from the gradient
            }}
        >
            Our Missions
            <span
            style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '75%',
                height: '4px',
                background: 'linear-gradient(to right, #0F4C8D 0%, #FFFEFE 100%)',
            }}
            />
        </h1>

        {/* Full-width container */}
        <div
        style={{
            width: '100%',
            height: '350px',
            backgroundColor: '#F4F4F4',
            display: 'flex',
            justifyContent: 'center',  // Centers the content horizontally
            alignItems: 'center',      // Centers the content vertically
            borderRadius: '15px',
            marginBottom: '50px',
        }}
        >
        {/* First Card */}
        <div
            style={{
            width: '50%',  // Make the card take 50% width of the container
            height: '280px',
            backgroundImage: "url('images/Rectangle1.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: '50px',
            marginLeft: '50px',
            borderRadius: '15px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',  // Allows flex properties for content inside the card
            flexDirection: 'column', // Ensures the title and paragraph stack vertically
            justifyContent: 'center', // Vertically center content
            }}
        >
            <h3
            style={{
                fontSize: '25px',
                fontWeight: 'bold',
                marginBottom: '20px',
                color: '#2C2828',
                textAlign: 'justify',
            }}
            >
            Simplify Healthcare Operations:
            </h3>
            <p
            style={{
                fontSize: '20px',
                color: '#454343',
                lineHeight: '30px',
                textAlign: 'justify',
            }}
            >
            We created our AI-powered healthcare system by combining cutting-edge technology, real-world research, and user-focused design to simplify processes, enhance efficiency.
            </p>
        </div>

        {/* Second Card */}
        <div
            style={{
            width: '50%',  // Make the card take 50% width of the container
            height: '280px',
            backgroundImage: "url('images/Rectangle2.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: '50px',
            margin: '0 50px',
            borderRadius: '15px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',  // Allows flex properties for content inside the card
            flexDirection: 'column', // Ensures the title and paragraph stack vertically
            justifyContent: 'center', // Vertically center content
            }}
        >
            <h3
            style={{
                fontSize: '25px',
                fontWeight: 'bold',
                marginBottom: '20px',
                color: '#2C2828',
                textAlign: 'justify',
            }}
            >
            Empowering Healthcare Excellence:
            </h3>
            <p
            style={{
                fontSize: '20px',
                color: '#454343',
                lineHeight: '30px',
                textAlign: 'justify',
            }}
            >
            We are committed to simplifying healthcare operations through innovative AI tools, actionable analytics, and user-centric platforms, enabling healthcare professionals to deliver efficient, high-quality care with ease.
            </p>
        </div>
        </div>
        <div
        style={{
            width: '100%',
            height: '350px',
            backgroundColor: '#F4F4F4',
            display: 'flex',
            justifyContent: 'center',  // Centers the content horizontally
            alignItems: 'center',      // Centers the content vertically
            borderRadius: '15px',
            marginBottom: '50px',
        }}
        >
        {/* First Card */}
        <div
            style={{
            width: '50%',  // Make the card take 50% width of the container
            height: '280px',
            backgroundImage: "url('images/Rectangle1.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: '50px',
            marginLeft: '50px',
            borderRadius: '15px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',  // Allows flex properties for content inside the card
            flexDirection: 'column', // Ensures the title and paragraph stack vertically
            justifyContent: 'center', // Vertically center content
            }}
        >
            <h3
            style={{
                fontSize: '25px',
                fontWeight: 'bold',
                marginBottom: '20px',
                color: '#2C2828',
                textAlign: 'justify',
            }}
            >
            Transforming Healthcare Delivery:
            </h3>
            <p
            style={{
                fontSize: '20px',
                color: '#454343',
                lineHeight: '30px',
                textAlign: 'justify',
            }}
            >
            Our mission is to modernize healthcare operations by integrating advanced technology, evidence-based practices, and intuitive design, ensuring seamless coordination and improved outcomes for patients and providers alike.
            </p>
        </div>

        {/* Second Card */}
        <div
            style={{
            width: '50%',  // Make the card take 50% width of the container
            height: '280px',
            backgroundImage: "url('images/Rectangle2.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: '50px',
            margin: '0 50px',
            borderRadius: '15px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',  // Allows flex properties for content inside the card
            flexDirection: 'column', // Ensures the title and paragraph stack vertically
            justifyContent: 'center', // Vertically center content
            }}
        >
            <h3
            style={{
                fontSize: '25px',
                fontWeight: 'bold',
                marginBottom: '20px',
                color: '#2C2828',
                textAlign: 'justify',
            }}
            >
            Revolutionizing Patient Care:
            </h3>
            <p
            style={{
                fontSize: '20px',
                color: '#454343',
                lineHeight: '30px',
                textAlign: 'justify',
            }}
            >
            We leverage AI-driven solutions and data-driven insights to streamline healthcare workflows, reduce administrative burdens, and empower healthcare providers to focus on delivering exceptional patient care.
            </p>
        </div>
        </div>
        </div>
      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default AboutUs;
