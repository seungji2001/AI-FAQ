package com.plateer.thingz.aiprompt.prompt;

import com.plateer.thingz.bo.dto.LiveChatInfo;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class FaqPromptBuilder {

    private static final String PROMPT_TEMPLATE = """
    ### 역할
    당신은 라이브 커머스 채팅 분석 전문가입니다.
    고객(USER)과 상담원(PD)의 대화에서 핵심 질문과 답변을 추출하여 FAQ를 생성합니다.
    
    ### 분석 기준
    1. **질문 통합**: 표현이 달라도 의미가 같으면 하나의 질문으로 처리
       - 예시: "배송 언제 되나요?", "언제 도착해요?", "배송기간이 어떻게 되나요?"
       - 통합: "배송 소요 기간 문의"
    
    2. **우선순위** (다음 기준으로 상위 3개 선정):
       - 가장 많이 등장한 질문
       - 고객이 가장 궁금해하는 중요한 질문
       - 명확한 답변이 있는 질문
    
    3. **답변 생성**: 
       - 같은 질문 그룹의 모든 PD 답변을 종합
       - 가장 정확하고 완전한 답변 하나로 통합
    
    ### 출력 형식 (매우 중요!)
    - 순수 JSON 배열만 출력하세요
    - ```json이나 ``` 같은 마크다운 문법 사용 금지
    - 설명 텍스트, 주석, 부가 설명 모두 금지
    - 정확히 3개의 FAQ 객체 생성
    - 공백이나 개행은 자유롭게 사용 가능
    
    ### JSON 구조
    [
      {
        "intent": "질문의 핵심 의도 (5-10자)",
        "questCont": "고객 친화적인 질문 문장",
        "ansCont": "명확하고 정확한 답변"
      }
    ]
    
    ### 출력 예시
    입력:
    [USER] 배송은 언제 되나요?
    [PD] 오늘 주문하시면 2-3일 소요됩니다.
    [USER] 환불 가능한가요?
    [PD] 구매 후 7일 이내 환불 가능합니다.
    [USER] 언제 받을 수 있어요?
    [PD] 평일 기준 2-3일 배송됩니다.
    
    출력:
    [
      {
        "intent": "배송 소요 기간",
        "questCont": "주문 후 배송은 얼마나 걸리나요?",
        "ansCont": "주문 후 평일 기준 2-3일 소요됩니다."
      },
      {
        "intent": "환불 정책",
        "questCont": "환불이 가능한가요?",
        "ansCont": "구매 후 7일 이내 환불 가능합니다."
      },
      {
        "intent": "상품 정보",
        "questCont": "이 상품의 특징은 무엇인가요?",
        "ansCont": "해당 상품은 프리미엄 품질로 고객 만족도가 높습니다."
      }
    ]
    
    ### 대화 로그
    %s
    
    위 대화 로그를 분석하여 순수 JSON 배열만 출력하세요. 마크다운 문법이나 추가 설명 없이 JSON만 응답하세요.
    """;

    public String build(List<LiveChatInfo> chatHistory) {
        String chatLog = chatHistory.stream()
                .map(chat -> "[USER] " + chat.getUserMsg() + "\n" +
                        "[PD] " + chat.getPdMsg())
                .collect(Collectors.joining("\n"));
        return PROMPT_TEMPLATE.formatted(chatLog);
    }
}