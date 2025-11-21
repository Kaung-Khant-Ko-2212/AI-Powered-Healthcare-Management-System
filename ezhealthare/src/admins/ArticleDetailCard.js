import React from "react";
import "../styles/ArticleDetailCard.css";
import CloseIcon from "@mui/icons-material/Close";
import ArticleIcon from "@mui/icons-material/Article";

const ArticleDetailCard = ({ article, onClose, onRemove }) => {
  return (
    <div className="article-detail-card">
      <div className="close-btn" onClick={onClose}>
        <CloseIcon />
      </div>
      <div className="card-content">
        <div className="article-header">
          <div className="article-icon"> <ArticleIcon sx={{ fontSize: 40 }} /> </div>
          <div className="article-title">
            <p className="que">Title:</p>
            <p className="ans">{article.title}</p>
          </div>
        </div>
        <div className="article-body">
          <div className="article-info">
            <p className="que">Category:</p>
            <p className="ans">{article.category}</p>
            <p className="que">Publish Date:</p>
            <p className="ans">{article.publishDate}</p>
          </div>
          <div className="article-content">
            <p className="que">Content:</p>
            <p className="ans">{article.content}</p>
          </div>
        </div>
        <div className="action-buttons">
          <div className="btn btn-remove" onClick={onRemove}>
            Remove Article
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailCard;
