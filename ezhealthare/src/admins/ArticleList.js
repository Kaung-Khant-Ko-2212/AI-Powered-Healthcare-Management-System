import React, { useState, useEffect } from "react";
import "./ArticleList.css";
import { FaTrash } from "react-icons/fa";
import Sidebar from "./Sidebar";
import axios from "axios";

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/article/all");
      console.log("Articles fetched:", response.data);
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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await axios.delete(`http://localhost:8080/api/article/${id}`);
        fetchArticles(); // Refresh the list
      } catch (error) {
        console.error("Error deleting article:", error);
      }
    }
  };

  const handleSearch = () => {
    let results = articles;
    if (searchTerm) {
      results = results.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedDate) {
      results = results.filter(article => 
        article.createdAt.substring(0, 10) === selectedDate
      );
    }
    if (selectedCategory) {
      results = results.filter(article => 
        article.category.id === parseInt(selectedCategory)
      );
    }
    setFilteredArticles(results);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <Sidebar />
      <div className="article-list">
        <div className="filter-container">
          <select onChange={(e) => setSelectedDate(e.target.value)}>
            <option value="">Select Date</option>
            {Array.from(new Set(articles.map(article => 
              article.createdAt.substring(0, 10)))).map(date => (
              <option key={date} value={date}>{formatDate(date)}</option>
            ))}
          </select>
          <select onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input 
            type="text" 
            placeholder="Search by article title" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <table className="article-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Publish Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredArticles.map((article) => (
              <tr key={article.id}>
                <td>{article.title}</td>
                <td>{article.category.name}</td>
                <td>{formatDate(article.createdAt)}</td>
                <td>
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDelete(article.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArticleList;
