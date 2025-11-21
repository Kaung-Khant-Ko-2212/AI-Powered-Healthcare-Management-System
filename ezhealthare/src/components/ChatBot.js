import { useState, useEffect } from "react";
import { AiFillBell } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiUpload } from "react-icons/fi";
import { MdImage } from "react-icons/md";
import Usernavbar from "./Usernavbar";

const ChatApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [botResponse, setBotResponse] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const sendMessage = async () => {
    if (!inputMessage.trim() && !file) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: file ? `${inputMessage} (${file.name})` : inputMessage },
    ]);
    setInputMessage("");
    setFile(null);
    setIsTyping(true);
    setBotResponse("");

    try {
      let response;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const fileType = file.type.startsWith("image/") ? "image" : "pdf";
        const endpoint =
          fileType === "image"
            ? "http://localhost:8080/api/chatbot/upload-image"
            : "http://localhost:8080/api/chatbot/upload-pdf";

        response = await axios.post(endpoint, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await axios.post("http://localhost:8080/api/chatbot/chat", {
          question: inputMessage,
        });
      }

      const botText = response.data.answer || response.data;
      setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: botText }]);
      typeWriterEffect(botText);
    } catch (error) {
      console.error("Error sending message:", error);
      typeWriterEffect("Sorry, something went wrong. Please try again later.");
    }
  };

  const typeWriterEffect = (text) => {
    let index = 0;
    let botText = "";
    setBotResponse("");

    const interval = setInterval(() => {
      botText += text[index];
      setBotResponse(botText);
      index++;
      if (index === text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 15);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <div className="flex flex-col h-screen">
      
      <Usernavbar/>
      <div className="flex flex-grow relative"style={{marginTop:"50px"}}>
        

        

        <div className={`flex bg-white font-cabin text-[16px] flex-col px-[50px] relative transition-all duration-500 ease-out ml-0 w-full`}>
          <div className="flex-grow p-6 overflow-auto">
            <div className="space-y-10">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.sender === "bot" && (
                    <img src="images/Chatbot.png" alt="Chatbot" className="h-12 w-12 mr-2" />
                  )}
                  <div className={`p-3 rounded-lg text-justify ${msg.sender === "user" ? "bg-[#CCE4FE] ml-14" : "bg-transparent mr-14"}`}>
                    {botResponse && msg.sender === "bot" && msg === messages[messages.length - 1] ? botResponse : msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <footer className="bg-white p-4 flex items-center">
            

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask something or upload a file..."
              className="flex-grow p-3 rounded-lg border border-gray-300 bg-[#CCE4FE]"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg ml-4" onClick={sendMessage}>
              Send
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
