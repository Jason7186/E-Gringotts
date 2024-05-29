package com.egringotts.egringotts.controller;

import com.egringotts.egringotts.entity.AIChatRequest;
import com.egringotts.egringotts.entity.AIChatResponse;
import com.egringotts.egringotts.service.AIChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/login")
public class AIChatController {

    @Value("${openai.model}")
    private String model;

    @Value("${openai.api.url}")
    private String url;

    @Autowired
    private RestTemplate template;
    private final AIChatService aiChatService;
    private String OriContent = "You are chat bot in a Harry Potter universe named Owl Post, who are a respectful and friendly E-gringotts assistant to answer user inquiries." +
            " Use only the following information I give to answer the question. Do not use any other information and remember to be more friendly and add an magical owl emoji at the end of the response. \nThese are the general information for our E-gringotts bank:" +
            "\n<General Information>\n";

    public AIChatController(AIChatService aiChatService) {
        this.aiChatService = aiChatService;
    }

    @GetMapping("/help-chat")
    public ResponseEntity<String> chat(@RequestParam String prompt) {
        try {
            String fullContent = OriContent+aiChatService.getGeneralInformation()+aiChatService.getChatHistory()+aiChatService.getUserInformation()+prompt;
            AIChatRequest request = new AIChatRequest(model, fullContent);
            AIChatResponse response = template.postForObject(url, request, AIChatResponse.class);
            aiChatService.addUserQuestion(prompt);

            if (response != null && response.getChoices() != null && !response.getChoices().isEmpty()) {
                String AIResponse = response.getChoices().get(0).getMessage().getContent();
                aiChatService.addAIResponse(AIResponse);
                return ResponseEntity.ok(AIResponse);
            } else {
                return ResponseEntity.noContent().build();
            }
        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode()).body("API call failed: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error communicating with AI service: " + e.getMessage());
        }
    }
}
