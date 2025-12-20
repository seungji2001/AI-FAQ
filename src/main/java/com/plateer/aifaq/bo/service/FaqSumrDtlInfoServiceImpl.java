package com.plateer.aifaq.bo.service;

import com.plateer.aifaq.bo.dto.FaqSumrDtlDto;
import com.plateer.aifaq.bo.mapper.FaqSumrDtlInfoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class FaqSumrDtlInfoServiceImpl implements FaqSumrDtlInfoService {


    final private FaqSumrDtlInfoMapper faqSumrDtlInfoMapper;

    @Transactional
    @Override
    public void insert(List<FaqSumrDtlDto> faqSumrDtlDto) {
        faqSumrDtlInfoMapper.insert(faqSumrDtlDto);
    }

    @Override
    public List<FaqSumrDtlDto> findAllByFaqId(Long faqId) {
        return faqSumrDtlInfoMapper.findAllByFaqId(faqId);
    }
}
