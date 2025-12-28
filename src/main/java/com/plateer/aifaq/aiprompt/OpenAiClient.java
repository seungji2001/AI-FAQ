package com.plateer.aifaq.aiprompt;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.Map;

@Component
public class OpenAiClient {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.model}")
    private String model;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://api.openai.com/v1")
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();

    public String request(String prompt) {

        int maxRetry = 3;
        int waitMs = 2000; // 2초

        for (int i = 0; i < maxRetry; i++) {
            try {
                return callOpenAi(prompt);
            } catch (WebClientResponseException.TooManyRequests e) {
                if (i == maxRetry - 1) {
                    throw e;
                }
                try {
                    Thread.sleep(waitMs);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
                waitMs *= 2; // exponential backoff
            }
        }
        throw new IllegalStateException("AI request failed");
    }

    private String callOpenAi(String prompt) {
        Map<String, Object> body = Map.of(
                "model", model,
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                ),
                "temperature", 0.2
        );

        return webClient.post()
                .uri("/chat/completions")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .map(res ->
                        ((Map)((List)res.get("choices")).get(0))
                                .get("message")
                )
                .map(msg -> (String)((Map)msg).get("content"))
                .block();
    }
}

