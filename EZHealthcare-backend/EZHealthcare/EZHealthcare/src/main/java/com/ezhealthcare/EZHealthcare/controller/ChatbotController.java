package com.ezhealthcare.EZHealthcare.controller;

import com.ezhealthcare.EZHealthcare.model.ChatRequest;
import com.ezhealthcare.EZHealthcare.model.ChatResponse;
import com.ezhealthcare.EZHealthcare.service.ChatbotService;
import com.ezhealthcare.EZHealthcare.service.OCRService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    private static final Logger logger = LoggerFactory.getLogger(ChatbotController.class);
    private final ChatbotService chatbotService;

    @Autowired
    public ChatbotController(ChatbotService chatbotService, OCRService ocrService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest chatRequest) {
        logger.info("Received chat request: {}", chatRequest.getQuestion());

        try {
            String response = chatbotService.generateResponse(chatRequest.getQuestion());
            return ResponseEntity.ok(new ChatResponse(response));
        } catch (Exception e) {
            logger.error("Error processing chat request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ChatResponse("An unexpected error occurred: " + e.getMessage()));
        }
    }
}
