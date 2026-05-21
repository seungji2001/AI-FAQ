package com.plateer.thingz.bo.service;

import com.plateer.thingz.bo.dto.LiveStrtEndDto;
import com.plateer.thingz.bo.enums.ErrorCode;
import com.plateer.thingz.bo.exception.BusinessException;
import com.plateer.thingz.bo.exception.InvalidRequestException;
import com.plateer.thingz.bo.exception.ResourceNotFoundException;
import com.plateer.thingz.bo.mapper.LiveStrtEndMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LiveStrtEndServiceImpl implements LiveStrtEndService {

    private final LiveStrtEndMapper liveStrtEndMapper;

    @Override
    public Optional<Integer> maxSeq(Long pgmId) {
        if(pgmId == null){
            throw new InvalidRequestException(ErrorCode.INVALID_REQUEST);
        }
        return liveStrtEndMapper.maxSeqGroupByPgmId(pgmId);
    }

    @Transactional
    @Override
    public int insertBatch(List<LiveStrtEndDto> liveStrtEndDto) {
        int result = liveStrtEndMapper.insertBatch(liveStrtEndDto);
        if(result == 0){
            throw new BusinessException(ErrorCode.FAQ_INSERTED_FAILED);
        }
        return result;
    }

    @Transactional
    @Override
    public void updateEndDateBypgmIdAndSeq(Long pgmId) {
        if(pgmId == null){
            throw new InvalidRequestException(ErrorCode.INVALID_REQUEST);
        }
        List<LiveStrtEndDto> liveStrtEndDto = this.findLiveStrtEndsByPgmId(pgmId);
        if(liveStrtEndDto.isEmpty()){
            throw new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND);
        }
        int updatedPgm = liveStrtEndMapper.updateEndDateBypgmIdAndSeq(pgmId);
        if(updatedPgm == 0){
            throw new BusinessException(ErrorCode.PGM_END_DATE_UPDATED_FAILED);
        }
    }

    @Override
    public List<LiveStrtEndDto> findLiveStrtEndsByPgmId(Long pgmId) {
        if(pgmId == null){
            throw new InvalidRequestException(ErrorCode.INVALID_REQUEST);
        }
        List<LiveStrtEndDto> liveStrtEndDtos = liveStrtEndMapper.findLiveStrtEndsByPgmId(pgmId);
        if(liveStrtEndDtos.isEmpty()){
            throw new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND);
        }
        return liveStrtEndDtos;
    }

    @Override
    public int findLiveStrtEndsEndDateIsNull() {
        int currentLiveStrtEnds = liveStrtEndMapper.findLiveStrtEndsEndDateIsNull();
        if(currentLiveStrtEnds > 0){
            throw new ResourceNotFoundException(ErrorCode.PGM_ALREADY_STARTED);
        }
        return currentLiveStrtEnds;
    }

    @Override
    public List<LiveStrtEndDto> findMstGoodsByPgmId(Long pgmId) {
        if(pgmId == null){
            throw new InvalidRequestException(ErrorCode.INVALID_REQUEST);
        }
        return liveStrtEndMapper.findMstGoodsByPgmId(pgmId);
    }

    @Override
    public Long findCurrentPgm() {
        return liveStrtEndMapper.findCurrentPgm();
    }
}
