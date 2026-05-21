package com.plateer.thingz.bo.service;

import com.plateer.thingz.bo.dto.FaqSumrDto;
import com.plateer.thingz.bo.dto.GoodsDto;
import com.plateer.thingz.bo.dto.LiveStrtEndDto;
import com.plateer.thingz.bo.dto.request.FaqSumrDtlRequestDto;
import com.plateer.thingz.bo.dto.request.FaqSumrRequestDto;
import com.plateer.thingz.bo.enums.ErrorCode;
import com.plateer.thingz.bo.exception.BusinessException;
import com.plateer.thingz.bo.exception.InvalidRequestException;
import com.plateer.thingz.bo.mapper.FaqSumrInfoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@RequiredArgsConstructor
@Service
public class FaqSumrInfoServiceImpl implements FaqSumrInfoService {

    final private FaqSumrInfoMapper faqSumrInfoMapper;

    @Transactional
    @Override
    public void insertMstGoods(List<LiveStrtEndDto> liveStrtEndDtos) {
        if(liveStrtEndDtos.isEmpty()){
            throw new InvalidRequestException(ErrorCode.INVALID_REQUEST);
        }
        int insertedMstGoods = faqSumrInfoMapper.insertMstGoods(liveStrtEndDtos);
        if(insertedMstGoods == 0){
            throw new BusinessException(ErrorCode.FAQ_INSERTED_FAILED);
        }
    }

    @Override
    public List<FaqSumrDto> findWaitingItems() {
        return faqSumrInfoMapper.findByLinkStatus("W");
    }

    @Transactional
    @Override
    public void updateLinkStatus(FaqSumrDto faqSumrInfo) {
        if(Objects.isNull(faqSumrInfo)){
            throw new InvalidRequestException(ErrorCode.INVALID_REQUEST);
        }
        int updatedLinkStatus = faqSumrInfoMapper.updateLinkStatus(faqSumrInfo);
        if(updatedLinkStatus == 0){
            throw new BusinessException(ErrorCode.FAQ_UPDATE_FAILED);
        }
    }

    @Override
    public List<FaqSumrDto> findAllOrderByIdDesc(FaqSumrRequestDto faqSumrRequestDto) {
        List<FaqSumrDto> faqSumrDtos = faqSumrInfoMapper.findAllOrderByIdDesc(faqSumrRequestDto);
        if(faqSumrDtos.isEmpty()){
            throw new BusinessException(ErrorCode.FAQ_NOT_FOUND);
        }
        return faqSumrDtos;
    }

    @Override
    public List<GoodsDto> findGoodsByFaqPgmId(Long faqPgmId) {
        List<GoodsDto> goodsDtos = faqSumrInfoMapper.findGoodsByFaqPgmId(faqPgmId);
        if(goodsDtos.isEmpty()){
            throw new BusinessException(ErrorCode.FAQ_NOT_FOUND);
        }
        return goodsDtos;
    }
}
