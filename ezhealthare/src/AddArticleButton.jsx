import React from "react";
import { useNavigate } from "react-router-dom";

const AddArticleButton = () => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/article")} className="add-article-btn">
      Add New Article
    </button>
  );
};

export default AddArticleButton;
