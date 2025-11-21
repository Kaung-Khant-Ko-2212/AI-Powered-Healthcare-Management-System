package com.ezhealthcare.EZHealthcare.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.concurrent.TimeoutException;

@Service
public class ChatbotService {
    private static final Logger logger = LoggerFactory.getLogger(ChatbotService.class);
    private static final String OLLAMA_URL = "http://localhost:11434/api/generate";
    private final WebClient webClient;

    public ChatbotService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(OLLAMA_URL).build();
    }
    
    public String generateResponse(String question) {
        logger.info("Sending request to Ollama for question: {}", question);

        String requestBody = String.format(
                "{\"model\": \"EZCareBot\", \"prompt\": \"%s\", \"stream\": false}", question);

        try {
            String response = webClient.post()
                    .uri("")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class) // ✅ Timeout added
                    .block();

            logger.info("Received response from Ollama: {}", response);
            return extractResponseText(response);
        } catch (WebClientResponseException e) {
            logger.error("Ollama API error: HTTP {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            return "Chatbot service is temporarily unavailable.";
        } catch (WebClientRequestException e) {
            logger.error("Failed to connect to Ollama: {}", e.getMessage());
            return "Could not connect to the AI service.";
        } catch (Exception e) {
            logger.error("Unexpected error: {}", e.getMessage(), e);
            return "An error occurred while processing your request.";
        }
    }


    private String extractResponseText(String jsonResponse) {
        try {
            logger.debug("Raw Ollama response: {}", jsonResponse);
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(jsonResponse);
            return rootNode.path("response").asText("Error processing response");
        } catch  (Exception e) {
            logger.error("Error parsing Ollama response: {}", e.getMessage(), e);
            return "Error processing response";
        }
    }
}