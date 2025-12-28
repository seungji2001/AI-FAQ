package com.plateer.aifaq.batch.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.plateer.aifaq.bo.dto.FaqSumrDtlDto;
import com.plateer.aifaq.bo.dto.FaqSumrDto;
import com.plateer.aifaq.bo.dto.LiveChatInfo;
import com.plateer.aifaq.batch.exception.PromptTooLongException;
import com.plateer.aifaq.bo.mapper.FaqSumrDtlInfoMapper;
import com.plateer.aifaq.bo.service.FaqSumrDtlInfoService;
import com.plateer.aifaq.bo.service.FaqSumrInfoService;
import com.plateer.aifaq.bo.service.LiveChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FaqSummarizationService {

    private final FaqSumrInfoService faqSumrService;
    private final LiveChatService liveChatService;
    private final AiSummarizationService aiSummarizationService;
    private final FaqSumrDtlInfoService faqSumrDtlInfoService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public void processFaqItem(FaqSumrDto faqItem) {
        try {
            // 채팅 이력 조회
            List<LiveChatInfo> chatHistory = liveChatService.getChatHistory(faqItem);

            if(chatHistory.isEmpty()){
                throw new IllegalArgumentException("No chat history found for faq item: " + faqItem);
            }

            // AI 요약 생성
            //String aiResult = aiSummarizationService.generateFaqSummary(chatHistory);
            String aiResult = """
                    [
                      {
                        "intent": "상품 가격 문의",
                        "questCont": "가격 좀 알려주세요",
                        "ansCont": "정가 89,000원인데 오늘만 59,900원입니다!"
                      },
                      {
                        "intent": "방송 일정 문의",
                        "questCont": "다음 방송은 언제인가요?",
                        "ansCont": "내일 저녁 8시에 다시 방송합니다."
                      },
                      {
                        "intent": "선물 포장 문의",
                        "questCont": "포장 예쁘게 해주시나요?",
                        "ansCont": "네! 선물 포장 무료로 해드리며, 포장도 예쁘게 해드립니다."
                      }
                    ]
                    """;

            if(!aiResult.isEmpty()){
               FaqSumrDto faqSumrInfo = FaqSumrDto.builder()
                       .pgmId(faqItem.getPgmId())
                       .linkStatus("A")
                       .build();
               faqSumrService.updateLinkStatus(faqSumrInfo);

                List<FaqSumrDtlDto> faqSumrDtlDtos = objectMapper.readValue(
                        aiResult,
                        new TypeReference<List<FaqSumrDtlDto>>() {}
                );
                List<FaqSumrDtlDto> faqSumrDtlDtoList = faqSumrDtlDtos.stream()
                                .map(fsd -> {
                                    FaqSumrDtlDto faq = FaqSumrDtlDto.builder()
                                            .questCont(fsd.getQuestCont())
                                            .ansCont(fsd.getAnsCont())
                                            .faqId(faqItem.getId())
                                            .dispYn("Y")
                                            .build();
                                    return faq;
                                }).toList();
                faqSumrDtlInfoService.insert(faqSumrDtlDtoList);
            }
        } catch (PromptTooLongException e) {
            FaqSumrDto faqSumrInfo = FaqSumrDto.builder()
                    .pgmId(faqItem.getPgmId())
                    .linkStatus("F")
                    .build();
            faqSumrService.updateLinkStatus(faqSumrInfo);
        } catch (Exception e) {
            log.error(e.getMessage());
            FaqSumrDto faqSumrInfo = FaqSumrDto.builder()
                    .pgmId(faqItem.getPgmId())
                    .linkStatus("F")
                    .build();
            faqSumrService.updateLinkStatus(faqSumrInfo);
        }
    }
}
