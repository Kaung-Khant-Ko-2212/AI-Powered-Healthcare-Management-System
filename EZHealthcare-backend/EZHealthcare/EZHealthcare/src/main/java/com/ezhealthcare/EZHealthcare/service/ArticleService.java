package com.ezhealthcare.EZHealthcare.service;

import com.ezhealthcare.EZHealthcare.model.Article;
import com.ezhealthcare.EZHealthcare.model.Category;
import com.ezhealthcare.EZHealthcare.repository.ArticleRepository;
import com.ezhealthcare.EZHealthcare.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Service
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    private final String uploadDir = "uploads/articles/";

    public ArticleService() {
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    @Transactional
    public Article createArticle(String title, Long categoryId, String content, MultipartFile image) {
        try {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            Article article = new Article();
            article.setTitle(title);
            article.setCategory(category);
            article.setContent(content);
            article.setCreatedAt(new Timestamp(System.currentTimeMillis()));

            if (image != null && !image.isEmpty()) {
                String fileName = saveImage(image);
                article.setImageUrl(fileName);
            }

            return articleRepository.save(article);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create article: " + e.getMessage());
        }
    }

    private String saveImage(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir + fileName);
        Files.copy(file.getInputStream(), filePath);
        return fileName;
    }

    private void deleteImage(String fileName) {
        try {
            Path filePath = Paths.get(uploadDir + fileName);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete image: " + e.getMessage());
        }
    }

    public List<Article> getAllArticles() {
        return articleRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<Article> getArticlesByCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return articleRepository.findByCategory(category);
    }

    public Article getArticleById(Long id) {
        return articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));
    }

    @Transactional
    public Article updateArticle(Long id, Long categoryId, String title, String content, MultipartFile image) {
        Article article = getArticleById(id);
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        article.setTitle(title);
        article.setCategory(category);
        article.setContent(content);
        article.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

        if (image != null && !image.isEmpty()) {
            try {
                // Delete old image if exists
                if (article.getImageUrl() != null) {
                    deleteImage(article.getImageUrl());
                }
                String fileName = saveImage(image);
                article.setImageUrl(fileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to update article image: " + e.getMessage());
            }
        }

        return articleRepository.save(article);
    }

    @Transactional
    public void deleteArticle(Long id) {
        Article article = getArticleById(id);
        if (article.getImageUrl() != null) {
            deleteImage(article.getImageUrl());
        }
        articleRepository.deleteById(id);
    }
}