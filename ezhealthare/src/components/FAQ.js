import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const FAQ = () => {
    const faqs = [
        {
          question: "Can the system integrate with existing hospital software?",
          iconPath: "/images/faq1.png",
        },
        {
          question: "How do patients benefit from this system?",
          iconPath: "/images/faq3.png",
        },
        {
          question: "What is this healthcare management system?",
          iconPath: "/images/faq5.png",
        },
        {
          question: "How does artificial intelligence improve the system?",
          iconPath: "/images/faq7.png",
        },
        {
          question: "Who can use this system?",
          iconPath: "/images/faq9.png",
        },
        {
          question: "Is training required to use the system?",
          iconPath: "/images/faq2.png",
        },
        {
          question: "Is the system scalable for larger healthcare organizations?",
          iconPath: "/images/faq4.png",
        },
        {
          question: "What are the key features of the system?",
          iconPath: "/images/faq6.png",
        },
        {
          question: "Is the system secure?",
          iconPath: "/images/faq8.png",
        },
        {
          question: "How can I get started with this system?",
          iconPath: "/images/faq10.png",
        },
      ];
  return (
    <div>
            {/* Navbar */}
            <Navbar />
            {/* FAQ Section */}
            <section className="py-10 px-6">
                <div className="mx-[46px]">
                    {/* Title */}
                    <h2
                    className="text-justify font-[Cabin] font-semibold text-[35px] leading-[48.6px] text-[#0F4C8D]"
                    >
                    Frequently Asked Questions
                    </h2>
                    {/* Subtitle */}
                    <p
                    className="text-justify font-[Cabin] font-semibold text-[20px] leading-[24.3px] text-[#454343] mt-2"
                    >
                    Stuck on something? We're here to help with all your questions and answers in one place.
                    </p>
                    {/* FAQ Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                    {faqs.map((faq, index) => (
                        <div
                        key={index}
                        className="flex h-28 items-start space-x-4 bg-white p-4 rounded-lg transition-shadow"
                        >
                        <img
                            src={faq.iconPath}
                            alt={`${faq.question} Icon`}
                            className="w-10 h-10 object-contain"
                        />
                        <p
                            className="font-[Cabin] font-semibold text-[20px] leading-[30.38px] text-[#454343]" style={{textAlign:"left"}}
                        >
                            {faq.question}
                        </p>
                        </div>
                    ))}
                    </div>
                </div>
            </section>
            <section>
                <div
                    className="px-6 py-10 m-[46px] shadow-md rounded-[7px] border border-gray-300"
                    style={{ 
                        backgroundImage: "url('/images/Rectangle3.png')",
                        backgroundSize: 'cover',
                    }}
                >
                    {/* FAQ Question with Icon */}
                    <div className="flex items-start space-x-4">
                    <img
                        src="/images/faq1.png"
                        alt="FAQ Icon"
                        className="w-10 h-10 object-contain"
                    />
                    <h3
                        className="font-[Cabin] font-medium text-[23px] leading-[30px] text-[#454343] text-justify"
                    >
                        Can the system integrate with existing hospital software?
                    </h3>
                    </div>
                    {/* Answer Section */}
                    <p
                    className="font-[Cabin] font-medium text-[20px] leading-[30px] text-[#454343] mt-1 text-justify"
                    >
                    Yes, the system supports integration with various third-party tools and software, allowing for a smooth transition and interoperability. Yes, the system supports integration with various third-party tools and software, allowing for a smooth transition and interoperability. Yes, the system supports integration with various third-party tools and software, allowing for a smooth transition and interoperability. Yes, the system supports integration with various third-party tools and software.
                    </p>
                </div>
                <div
                    className="px-6 py-10 m-[46px] shadow-md rounded-[7px] border border-gray-300"
                    style={{ 
                        backgroundImage: "url('/images/Rectangle4.png')",
                        backgroundSize: 'cover',
                    }}
                >
                    {/* FAQ Question with Icon */}
                    <div className="flex items-start space-x-4">
                    <img
                        src="/images/faq3.png"
                        alt="FAQ Icon"
                        className="w-10 h-10 object-contain"
                    />
                    <h3
                        className="font-[Cabin] font-medium text-[23px] leading-[30px] text-[#454343] text-justify"
                    >
                        How do patients benefit from this system?
                    </h3>
                    </div>
                    {/* Answer Section */}
                    <p
                    className="font-[Cabin] font-medium text-[20px] leading-[30px] text-[#454343] mt-1 text-justify"
                    >
                    Patients benefit from faster appointment scheduling, improved communication with providers, access to health resources, and personalized care enabled by AI. Patients benefit from faster appointment scheduling, improved communication with providers, access to health resources, and personalized care enabled by AI. Patients benefit from faster appointment scheduling, improved communication with providers, access to health resources, and personalized care enabled by AI.
                    </p>
                </div>
                <div
                    className="px-6 py-10 m-[46px] shadow-md rounded-[7px] border border-gray-300"
                    style={{ 
                        backgroundImage: "url('/images/Rectangle3.png')",
                        backgroundSize: 'cover',
                    }}
                >
                    {/* FAQ Question with Icon */}
                    <div className="flex items-start space-x-4">
                    <img
                        src="/images/faq5.png"
                        alt="FAQ Icon"
                        className="w-10 h-10 object-contain"
                    />
                    <h3
                        className="font-[Cabin] font-medium text-[23px] leading-[30px] text-[#454343] text-justify"
                    >
                        What is this healthcare management system?
                    </h3>
                    </div>
                    {/* Answer Section */}
                    <p
                    className="font-[Cabin] font-medium text-[20px] leading-[30px] text-[#454343] mt-1 text-justify"
                    >
                    Yes, the system supports integration with various third-party tools and software, allowing for a smooth transition and interoperability. Yes, the system supports integration with various third-party tools and software, allowing for a smooth transition and interoperability. Yes, the system supports integration with various third-party tools and software, allowing for a smooth transition and interoperability. Yes, the system supports integration with various third-party tools and software.
                    </p>
                </div> 
                <div
                    className="px-6 py-10 m-[46px] shadow-md rounded-[7px] border border-gray-300"
                    style={{
                        backgroundImage: "url('/images/Rectangle4.png')",
                        backgroundSize: "cover",
                    }}
                    >
                    <div className="flex items-start space-x-4">
                        <img
                        src="/images/faq7.png"
                        alt="FAQ Icon"
                        className="w-10 h-10 object-contain"
                        />
                        <h3 className="font-[Cabin] font-medium text-[23px] leading-[30px] text-[#454343] text-justify">
                        How does artificial intelligence improve the system?
                        </h3>
                    </div>
                    <p className="font-[Cabin] font-medium text-[20px] leading-[30px] text-[#454343] mt-1 text-justify">
                        Artificial intelligence plays a crucial role in enhancing the system by
                        offering advanced features such as personalized patient care, predictive
                        analytics, and intelligent decision-making. AI algorithms analyze vast
                        amounts of medical data to provide healthcare professionals with insights
                        that improve diagnosis accuracy and treatment plans. The system uses AI
                        to automate routine tasks, such as appointment scheduling and patient
                        reminders, which reduces administrative burdens and allows medical staff
                        to focus more on patient care. Additionally, the system continuously
                        learns from patient data, ensuring that it adapts to evolving healthcare
                        needs and provides recommendations tailored to each individual’s condition.
                    </p>
                    </div>
                <div
                    className="px-6 py-10 m-[46px] shadow-md rounded-[7px] border border-gray-300"
                    style={{
                    backgroundImage: "url('/images/Rectangle3.png')",
                    backgroundSize: "cover",
                    }}
                    >
                    <div className="flex items-start space-x-4">
                    <img
                        src="/images/faq9.png"
                        alt="FAQ Icon"
                        className="w-10 h-10 object-contain"
                    />
                    <h3 className="font-[Cabin] font-medium text-[23px] leading-[30px] text-[#454343] text-justify">
                        Who can use this system?
                    </h3>
                    </div>
                    <p className="font-[Cabin] font-medium text-[20px] leading-[30px] text-[#454343] mt-1 text-justify">
                    The system is designed for use by various healthcare professionals,
                    including doctors, nurses, and hospital administrators. It is also
                    accessible to patients for appointment scheduling and communication with
                    their healthcare providers. Additionally, healthcare organizations can use
                    the system to manage administrative workflows, track performance metrics,
                    and enhance collaboration between medical teams. The platform is flexible
                    and can be tailored to the needs of any healthcare institution, large or small.
                    </p>
                    </div>               
                <div
                    className="px-6 py-10 m-[46px] shadow-md rounded-[7px] border border-gray-300"
                    style={{
                    backgroundImage: "url('/images/Rectangle4.png')",
                    backgroundSize: "cover",
                    }}
                    >
                    {/* FAQ Question with Icon */}
                    <div className="flex items-start space-x-4">
                    <img
                        src="/images/faq2.png"
                        alt="FAQ Icon"
                        className="w-10 h-10 object-contain"
                    />
                    <h3 className="font-[Cabin] font-medium text-[23px] leading-[30px] text-[#454343] text-justify">
                        Is training required to use the system?
                    </h3>
                    </div>
                    {/* Answer Section */}
                    <p className="font-[Cabin] font-medium text-[20px] leading-[30px] text-[#454343] mt-1 text-justify">
                    No extensive training is required to use the system. The interface is
                    user-friendly and designed to be intuitive for healthcare professionals.
                    However, we provide comprehensive training materials, detailed video
                    tutorials, and dedicated support to guide new users through the initial
                    setup and operations. Additionally, our team is always available to assist
                    with any questions or concerns, ensuring a smooth onboarding process.
                    </p>
                    </div>

                    <div
                    className="px-6 py-10 m-[46px] shadow-md rounded-[7px] border border-gray-300"
                    style={{
                    backgroundImage: "url('/images/Rectangle3.png')",
                    backgroundSize: "cover",
                    }}
                    >
                    <div className="flex items-start space-x-4">
                    <img
                        src="/images/faq4.png"
                        alt="FAQ Icon"
                        className="w-10 h-10 object-contain"
                    />
                    <h3 className="font-[Cabin] font-medium text-[23px] leading-[30px] text-[#454343] text-justify">
                        Is the system scalable for larger healthcare organizations?
                    </h3>
                    </div>
                    <p className="font-[Cabin] font-medium text-[20px] leading-[30px] text-[#454343] mt-1 text-justify">
                    Yes, the system is designed to be scalable, allowing it to handle the needs
                    of both small clinics and large healthcare organizations. It can be
                    easily customized to fit the specific requirements of larger organizations,
                    such as multiple departments, increased patient volume, and advanced data
                    management. Our cloud-based infrastructure ensures that the system can
                    grow with your organization while maintaining high performance and data
                    security.
                    </p>
                    </div>

                    <div
                    className="px-6 py-10 m-[46px] shadow-md rounded-[7px] border border-gray-300"
                    style={{
                    backgroundImage: "url('/images/Rectangle4.png')",
                    backgroundSize: "cover",
                    }}
                    >
                    <div className="flex items-start space-x-4">
                    <img
                        src="/images/faq6.png"
                        alt="FAQ Icon"
                        className="w-10 h-10 object-contain"
                    />
                    <h3 className="font-[Cabin] font-medium text-[23px] leading-[30px] text-[#454343] text-justify">
                        What are the key features of the system?
                    </h3>
                    </div>
                    <p className="font-[Cabin] font-medium text-[20px] leading-[30px] text-[#454343] mt-1 text-justify">
                    The system includes a range of powerful features such as appointment
                    scheduling, patient management, secure communication, and seamless
                    integration with third-party tools. Additionally, it offers AI-powered
                    personalized care suggestions, advanced analytics for informed decision-making,
                    automated patient reminders, real-time data monitoring, and comprehensive
                    reporting tools. These features work together to streamline operations and
                    improve patient care outcomes.
                    </p>
                    </div>

                    <div
                    className="px-6 py-10 m-[46px] shadow-md rounded-[7px] border border-gray-300"
                    style={{
                    backgroundImage: "url('/images/Rectangle3.png')",
                    backgroundSize: "cover",
                    }}
                    >
                    <div className="flex items-start space-x-4">
                    <img
                        src="/images/faq8.png"
                        alt="FAQ Icon"
                        className="w-10 h-10 object-contain"
                    />
                    <h3 className="font-[Cabin] font-medium text-[23px] leading-[30px] text-[#454343] text-justify">
                        Is the system secure?
                    </h3>
                    </div>
                    <p className="font-[Cabin] font-medium text-[20px] leading-[30px] text-[#454343] mt-1 text-justify">
                    Yes, the system is built with robust security measures to ensure the
                    protection of sensitive healthcare data. It uses end-to-end encryption for
                    all data storage and transmission, along with multi-factor authentication
                    and regular security audits. We comply with strict healthcare regulations
                    like HIPAA, ensuring that patient data is always confidential, secure, and
                    protected from unauthorized access or breaches. We also offer continuous
                    updates and monitoring to keep the system aligned with the latest security
                    standards.
                    </p>
                    </div>
                    <div
                    className="px-6 py-10 m-[46px] shadow-md rounded-[7px] border border-gray-300"
                    style={{
                    backgroundImage: "url('/images/Rectangle4.png')",
                    backgroundSize: "cover",
                    }}
                    >
                    <div className="flex items-start space-x-4">
                    <img
                        src="/images/faq10.png"
                        alt="FAQ Icon"
                        className="w-10 h-10 object-contain"
                    />
                    <h3 className="font-[Cabin] font-medium text-[23px] leading-[30px] text-[#454343] text-justify">
                        How can I get started with this system?
                    </h3>
                    </div>
                    <p className="font-[Cabin] font-medium text-[20px] leading-[30px] text-[#454343] mt-1 text-justify">
                    Getting started with the system is simple and straightforward. First,
                    reach out to us for a personalized demo or consultation, where our team
                    will walk you through the key features and benefits. After signing up for
                    an account, you’ll receive access to our onboarding guide, which includes
                    step-by-step instructions, training materials, and video tutorials to
                    familiarize you with the platform. Should you need additional help, our
                    dedicated support team is always available to assist you, ensuring a smooth
                    transition to using the system for your healthcare management needs.
                    </p>
                    </div>
                    <Footer />
            </section>
        </div>
  );
};

export default FAQ;
