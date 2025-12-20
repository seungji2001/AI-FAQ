package com.plateer.aifaq.bo.controller;

import com.plateer.aifaq.bo.dto.FaqSumrDtlDto;
import com.plateer.aifaq.bo.dto.FaqSumrDto;
import com.plateer.aifaq.bo.service.FaqSumrDtlInfoService;
import com.plateer.aifaq.bo.service.FaqSumrInfoService;
import com.plateer.aifaq.bo.service.GoodsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/faq")
@RequiredArgsConstructor
public class FaqSumrController {
    private final FaqSumrInfoService faqSumrInfoService;
    private final FaqSumrDtlInfoService faqSumrDtlInfoService;

    @GetMapping
    public ResponseEntity<List<FaqSumrDto>> findAll() {
        return ResponseEntity.ok(faqSumrInfoService.findAllOrderByIdDesc());
    }

    @GetMapping("/dtl/{faqId}")
    public ResponseEntity<List<FaqSumrDtlDto>> findByFaqId(@PathVariable Long faqId) {
        return ResponseEntity.ok(faqSumrDtlInfoService.findAllByFaqId(faqId));
    }
}
