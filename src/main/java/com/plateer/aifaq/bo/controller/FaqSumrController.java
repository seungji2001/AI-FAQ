package com.plateer.aifaq.bo.controller;

import com.plateer.aifaq.bo.dto.FaqSumrDtlDto;
import com.plateer.aifaq.bo.dto.FaqSumrDto;
import com.plateer.aifaq.bo.dto.GoodsDto;
import com.plateer.aifaq.bo.dto.request.FaqSumrDtlRequestDto;
import com.plateer.aifaq.bo.dto.request.FaqSumrRequestDto;
import com.plateer.aifaq.bo.service.FaqSumrDtlInfoService;
import com.plateer.aifaq.bo.service.FaqSumrInfoService;
import com.plateer.aifaq.bo.service.GoodsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faq")
@RequiredArgsConstructor
public class FaqSumrController {
    private final FaqSumrInfoService faqSumrInfoService;
    private final FaqSumrDtlInfoService faqSumrDtlInfoService;

    @PostMapping
    public ResponseEntity<List<FaqSumrDto>> findAll(@RequestBody FaqSumrRequestDto faqSumrRequestDto) {
        return ResponseEntity.ok(faqSumrInfoService.findAllOrderByIdDesc(faqSumrRequestDto));
    }

    @GetMapping("/dtl/{faqId}")
    public ResponseEntity<List<FaqSumrDtlDto>> findByFaqId(@PathVariable Long faqId) {
        return ResponseEntity.ok(faqSumrDtlInfoService.findAllByFaqId(faqId));
    }

    //프로그램 아이디 별 faq 요약 전송된 상품 정보 조회
    @GetMapping("/goods/{pgmId}")
    public ResponseEntity<List<GoodsDto>>  findGoodsByFaqPgmId (@PathVariable Long pgmId) {
        return ResponseEntity.ok(faqSumrInfoService.findGoodsByFaqPgmId(pgmId));
    }

    //faq 상세 노출 여부 변경
    @PostMapping("/dispYn")
    public void updateDispYn (@RequestBody FaqSumrDtlRequestDto faqSumrDtlRequestDto) {
        faqSumrDtlInfoService.updateDispYn(faqSumrDtlRequestDto);
    }
}
