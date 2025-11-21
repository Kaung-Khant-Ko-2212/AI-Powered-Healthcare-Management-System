package com.ezhealthcare.EZHealthcare.controller;

import com.ezhealthcare.EZHealthcare.model.Article;
import com.ezhealthcare.EZHealthcare.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/article")
@CrossOrigin("*")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @PostMapping("/create")
    public ResponseEntity<?> createArticle(
            @RequestParam("title") String title,
            @RequestParam("category_id") Long categoryId,
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            Article article = articleService.createArticle(title, categoryId, content, image);
            return ResponseEntity.ok(article);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating article: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Article>> getAllArticles() {
        try {
            List<Article> articles = articleService.getAllArticles();
            return ResponseEntity.ok(articles);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getArticleById(@PathVariable Long id) {
        try {
            Article article = articleService.getArticleById(id);
            return ResponseEntity.ok(article);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Article>> getArticlesByCategory(@PathVariable Long categoryId) {
        try {
            List<Article> articles = articleService.getArticlesByCategory(categoryId);
            return ResponseEntity.ok(articles);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/image/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads/articles/" + filename);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateArticle(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("category_id") Long categoryId,
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            Article article = articleService.updateArticle(id, categoryId, title, content, image);
            return ResponseEntity.ok(article);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating article: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteArticle(@PathVariable Long id) {
        try {
            articleService.deleteArticle(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting article: " + e.getMessage());
        }
    }
}