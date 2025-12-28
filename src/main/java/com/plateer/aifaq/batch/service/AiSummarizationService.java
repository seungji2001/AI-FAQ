package com.plateer.aifaq.batch.service;

import com.plateer.aifaq.aiprompt.OpenAiClient;
import com.plateer.aifaq.aiprompt.prompt.FaqPromptBuilder;
import com.plateer.aifaq.bo.dto.LiveChatInfo;
import com.plateer.aifaq.batch.exception.PromptTooLongException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiSummarizationService {

    private static final int MAX_PROMPT_LENGTH = 5000;

    private final OpenAiClient openAiClient;
    private final FaqPromptBuilder promptBuilder;

    public String generateFaqSummary(List<LiveChatInfo> chatHistory) {
        String prompt = promptBuilder.build(chatHistory);

        validatePromptLength(prompt);

        return openAiClient.request(prompt);
    }

    private void validatePromptLength(String prompt) {
        if (prompt.length() > MAX_PROMPT_LENGTH) {
            throw new PromptTooLongException(
                    String.format("프롬프트 길이가 제한을 초과했습니다. (현재: %d, 최대: %d)",
                            prompt.length(), MAX_PROMPT_LENGTH)
            );
        }
    }
}