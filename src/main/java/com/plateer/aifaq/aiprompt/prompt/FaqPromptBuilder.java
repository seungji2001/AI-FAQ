package com.plateer.aifaq.aiprompt.prompt;

import com.plateer.aifaq.bo.dto.LiveChatInfo;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class FaqPromptBuilder {

    private static final String PROMPT_TEMPLATE = """
        너는 고객 상담 대화를 분석해서 FAQ를 생성하는 AI야.
        
        아래에는 고객(USER)과 상담원(PD)의 실제 대화 로그가 있다.
        고객의 질문은 표현은 다를 수 있지만, 의미가 같다면 같은 질문으로 판단해야 한다.
        
        ### 작업 지침
        1. 고객 질문(USER)을 의미 기준으로 분류한다.
           - 예: "배송은 언제 되나요?", "언제 도착하나요?", "오늘 주문하면 언제 받아요?"
             → 모두 '배송 일정 문의'로 같은 질문
        2. 가장 많이 등장하거나 대표성이 높은 질문 3가지를 선택한다.
        3. 각 질문 그룹에 해당하는 상담원(PD) 답변을 모두 종합하여 하나의 답변으로 요약한다.
        4. 각 질문마다 FAQ 질문과 FAQ 답변을 생성한다.
        
        ### 출력 규칙 (매우 중요)
        - 반드시 JSON 배열로만 응답한다.
        - 총 3개의 FAQ만 생성한다.
        - 불필요한 설명 문장은 절대 포함하지 않는다.
        
        ### 출력 JSON 형식
        [
          {
            "intent": "",
            "questCont": "",
            "ansCont": ""
          }
        ]
        
        ### 대화 로그
        %s
        """;

    public String build(List<LiveChatInfo> chatHistory) {
        String chatLog = chatHistory.stream()
                .map(chat -> "[USER] " + chat.getUserMsg() + "\n" +
                        "[PD] " + chat.getPdMsg())
                .collect(Collectors.joining("\n"));
        return PROMPT_TEMPLATE.formatted(chatLog);
    }
}