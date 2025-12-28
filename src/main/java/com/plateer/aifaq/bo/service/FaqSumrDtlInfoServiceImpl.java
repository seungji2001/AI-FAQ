package com.plateer.aifaq.bo.service;

import com.plateer.aifaq.bo.dto.FaqSumrDtlDto;
import com.plateer.aifaq.bo.dto.request.FaqSumrDtlRequestDto;
import com.plateer.aifaq.bo.enums.ErrorCode;
import com.plateer.aifaq.bo.exception.BusinessException;
import com.plateer.aifaq.bo.exception.InvalidRequestException;
import com.plateer.aifaq.bo.exception.ResourceNotFoundException;
import com.plateer.aifaq.bo.mapper.FaqSumrDtlInfoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.Objects;

@RequiredArgsConstructor
@Service
public class FaqSumrDtlInfoServiceImpl implements FaqSumrDtlInfoService {


    final private FaqSumrDtlInfoMapper faqSumrDtlInfoMapper;

    @Transactional
    @Override
    public void insert(List<FaqSumrDtlDto> faqSumrDtlDto) {
        if(CollectionUtils.isEmpty(faqSumrDtlDto)){
            throw new InvalidRequestException("등록할 FAQ 상세 정보가 없습니다.");
        }
        int insertedCount = faqSumrDtlInfoMapper.insert(faqSumrDtlDto);
        if(insertedCount == 0){
            throw new BusinessException(ErrorCode.FAQ_INSERTED_FAILED);
        }
    }

    @Override
    public List<FaqSumrDtlDto> findAllByFaqId(Long faqId) {
        List<FaqSumrDtlDto> faqSumrDtlDtos = faqSumrDtlInfoMapper.findAllByFaqId(faqId);
        if(CollectionUtils.isEmpty(faqSumrDtlDtos)){
            throw new ResourceNotFoundException("FAQ 번호 " + faqId + "에 해당되는 FAQ 상세 내역이 존재하지 않습니다.");
        }
        return faqSumrDtlDtos;
    }

    @Transactional
    @Override
    public void updateDispYn(FaqSumrDtlRequestDto faqSumrDtlRequestDto) {
        int updatedFaq = faqSumrDtlInfoMapper.updateDispYn(faqSumrDtlRequestDto);
        if(updatedFaq == 0){
            throw new BusinessException(ErrorCode.FAQ_UPDATE_FAILED);
        }
    }
}
