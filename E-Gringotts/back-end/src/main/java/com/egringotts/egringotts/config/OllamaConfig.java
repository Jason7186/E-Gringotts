//package com.egringotts.egringotts.config;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.client.RestClient;
//import io.thomasvitale.langchain4j.spring.ollama.client.OllamaClient;
//import io.thomasvitale.langchain4j.spring.ollama.client.OllamaClientConfig;
//
//import java.net.URI;
//import java.time.Duration;
//
//@Configuration
//public class OllamaConfig {
//
//    @Bean
//    public OllamaClientConfig ollamaClientConfig() {
//        return OllamaClientConfig.builder()
//                .baseUrl(URI.create("http://localhost:11434"))
//                .connectTimeout(Duration.ofSeconds(10))
//                .readTimeout(Duration.ofSeconds(60))
//                .build();
//    }
//
//    @Bean
//    public OllamaClient ollamaClient(OllamaClientConfig ollamaClientConfig) {
//        return new OllamaClient(ollamaClientConfig, RestClient.builder());
//    }
//
//    @Bean
//    public OllamaChatModel ollamaChatModel(OllamaClient ollamaClient) {
//        return OllamaChatModel.builder()
//                .client(ollamaClient)
//                .model("llama3")
//                .build();
//    }
//}