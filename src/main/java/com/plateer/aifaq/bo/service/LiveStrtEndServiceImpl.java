package com.plateer.aifaq.bo.service;

import com.plateer.aifaq.bo.dto.LiveStrtEndDto;
import com.plateer.aifaq.bo.mapper.LiveStrtEndMapper;
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
        return liveStrtEndMapper.maxSeqGroupByPgmId(pgmId);
    }

    @Transactional
    @Override
    public int insertBatch(List<LiveStrtEndDto> liveStrtEndDto) {
        int result = liveStrtEndMapper.insertBatch(liveStrtEndDto);
        if(result == 0){
            throw new RuntimeException("Error inserting LiveStrtEnd");
        }
        return result;
    }

    @Transactional
    @Override
    public void updateEndDateBypgmIdAndSeq(Long pgmId) {
        List<LiveStrtEndDto> liveStrtEndDto = this.findLiveStrtEndsByPgmId(pgmId);
        if(liveStrtEndDto.isEmpty()){
            throw new IllegalArgumentException(pgmId + " 프로그램에 대한 정보가 없습니다");
        }
        liveStrtEndMapper.updateEndDateBypgmIdAndSeq(pgmId);
    }

    @Override
    public List<LiveStrtEndDto> findLiveStrtEndsByPgmId(Long pgmId) {
        return liveStrtEndMapper.findLiveStrtEndsByPgmId(pgmId);
    }

    @Override
    public int findLiveStrtEndsEndDateIsNull() {
        return liveStrtEndMapper.findLiveStrtEndsEndDateIsNull();
    }

    @Override
    public List<LiveStrtEndDto> findMstGoodsByPgmId(Long pgmId) {
        return liveStrtEndMapper.findMstGoodsByPgmId(pgmId);
    }

    @Override
    public Long findCurrentPgm() {
        return liveStrtEndMapper.findCurrentPgm();
    }
}
