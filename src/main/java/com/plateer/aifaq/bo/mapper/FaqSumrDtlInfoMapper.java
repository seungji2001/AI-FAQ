package com.plateer.aifaq.bo.mapper;

import com.plateer.aifaq.bo.dto.FaqSumrDtlDto;
import com.plateer.aifaq.bo.dto.request.FaqSumrDtlRequestDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface FaqSumrDtlInfoMapper {
    public int insert(List<FaqSumrDtlDto> faqSumrDtlDto);
    public List<FaqSumrDtlDto> findAllByFaqId(Long faqId);
    public int updateDispYn(FaqSumrDtlRequestDto faqSumrDtlRequestDto);
}
