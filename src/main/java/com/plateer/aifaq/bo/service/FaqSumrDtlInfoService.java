package com.plateer.aifaq.bo.service;

import com.plateer.aifaq.bo.dto.FaqSumrDtlDto;
import com.plateer.aifaq.bo.dto.request.FaqSumrDtlRequestDto;

import java.util.List;

public interface FaqSumrDtlInfoService {
    public void insert(List<FaqSumrDtlDto> faqSumrDtlDto);
    public List<FaqSumrDtlDto> findAllByFaqId(Long faqId);
    void updateDispYn(FaqSumrDtlRequestDto faqSumrDtlRequestDto);
}
