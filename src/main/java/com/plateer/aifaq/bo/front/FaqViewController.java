package com.plateer.aifaq.bo.front;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller  // ⭐ @Controller 사용 (Thymeleaf용)
@RequestMapping("/bo/faq")
public class FaqViewController {

    /**
     * FAQ 목록 화면
     */
    @GetMapping("/list")
    public String faqListPage() {
        return "bo/faq/list";  // templates/bo/faq/list.html
    }

    /**
     * FAQ 상세 화면
     */
    @GetMapping("/detail")
    public String faqDetailPage() {
        return "bo/faq/detail";  // templates/bo/faq/detail.html
    }
}