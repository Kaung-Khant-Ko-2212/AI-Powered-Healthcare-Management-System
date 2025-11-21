import React, { useState, useEffect } from "react";
import "./ArticlePage.css";
import { Link } from "react-router-dom";
import Usernavbar from "./Usernavbar";
import axios from "axios";

function ArticlePage() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/article/all");
      setArticles(response.data);
      setFilteredArticles(response.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/categories/all");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    if (categoryName === "All") {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(
        article => article.category.name === categoryName
      );
      setFilteredArticles(filtered);
    }
  };

  const handleSearch = () => {
    const filtered = articles.filter(article => 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArticles(filtered);
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/images/default-article.jpg'; // Add a default image
    return `http://localhost:8080/api/article/image/${imageUrl}`;
  };

  return (
    <div className="article-page">
      {/* Navbar */}
      <Usernavbar />

      {/* Search and Categories */}
      <div className="article2-container" style={{ marginTop: '80px' }}>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by article name or category"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <div className="search-button" onClick={handleSearch}>Search</div>
        </div>
        <div className="categories">
          <div 
            className={`category-button ${selectedCategory === "All" ? "active" : ""}`}
            onClick={() => handleCategoryClick("All")}
          >
            All
          </div>
          {categories.map((category) => (
            <div
              key={category.id}
              className={`category-button ${selectedCategory === category.name ? "active" : ""}`}
              onClick={() => handleCategoryClick(category.name)}
            >
              {category.name}
            </div>
          ))}
        </div>

        {/* Articles Section */}
        <div className="articles2">
          {filteredArticles.map((article) => (
            <div className="article2-card" key={article.id}>
              <div className="article-image-container">
                <img 
                  src={getImageUrl(article.imageUrl)}
                  alt={article.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/default-article.jpg';
                  }}
                />
              </div>
              <div className="article2-content">
                <h3>{article.title}</h3>
                <p className="article-category">{article.category.name}</p>
                <p className="article-date">
                  {new Date(article.createdAt).toLocaleDateString()}
                </p>
                <p className="article-excerpt">
                  {article.content.length > 200 
                    ? article.content.substring(0, 200) + "..."
                    : article.content}
                </p>
                <Link to={`/article/${article.id}`} className="read-more">
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      
    </div>
  );
}

export default ArticlePage;
