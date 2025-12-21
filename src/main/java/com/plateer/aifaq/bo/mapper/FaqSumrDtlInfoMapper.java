package com.plateer.aifaq.bo.mapper;

import com.plateer.aifaq.bo.dto.FaqSumrDtlDto;
import com.plateer.aifaq.bo.dto.request.FaqSumrDtlRequestDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface FaqSumrDtlInfoMapper {
    public void insert(List<FaqSumrDtlDto> faqSumrDtlDto);
    public List<FaqSumrDtlDto> findAllByFaqId(Long faqId);
    void updateDispYn(FaqSumrDtlRequestDto faqSumrDtlRequestDto);
}
