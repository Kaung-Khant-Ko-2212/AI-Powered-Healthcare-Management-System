import React, { useState, useEffect } from "react";
import "./Article.css";
import Sidebar from "./Sidebar";
import axios from "axios";

const Article = () => {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log("Fetching categories...");
      const response = await axios.get("http://localhost:8080/api/categories/all");
      console.log("Categories response:", response.data);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error.response || error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handlePublish = async () => {
    if (!title || !categoryId || !content) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category_id", categoryId);
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }

      console.log("Sending data:", {
        title,
        category_id: categoryId,
        content,
        hasImage: !!image
      });

      const response = await axios.post("http://localhost:8080/api/article/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);

      if (response.status === 200) {
        alert("Article published successfully!");
        setTitle("");
        setCategoryId("");
        setContent("");
        setImage(null);
      }
    } catch (error) {
      console.error("Error publishing article:", error);
      alert(error.response?.data || "Failed to publish article. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    if (!title || !categoryId || !content) {
      alert("Please fill in all required fields to preview.");
      return;
    }

    // Create preview object
    const preview = {
      title,
      categoryId,
      content,
      imageUrl: image ? URL.createObjectURL(image) : null
    };

    // You could show this in a modal or new window
    console.log("Preview:", preview);
    alert("Preview feature coming soon!");
  };

  return (
    <div>
      <Sidebar />
      <div className="article-container">
        <div className="article-form">
          <h1>Add New Article</h1>

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter article title"
              required
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input"
            />
            {image && (
              <div className="image-preview">
                <img src={URL.createObjectURL(image)} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Content *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="6"
              placeholder="Write your article content here..."
              required
            />
          </div>

          <div className="button-group">
            <button
              className="publish-button"
              onClick={handlePublish}
              disabled={loading}
            >
              {loading ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
