package com.plateer.thingz.bo.service;

import com.plateer.thingz.bo.dto.LiveStrtEndDto;

import java.util.List;
import java.util.Optional;

public interface LiveStrtEndService {
    public Optional<Integer> maxSeq(Long pgmId);
    public int insertBatch(List<LiveStrtEndDto> liveStrtEndDto);
    public void updateEndDateBypgmIdAndSeq(Long pgmId);
    public List<LiveStrtEndDto> findLiveStrtEndsByPgmId(Long pgmId);
    public int findLiveStrtEndsEndDateIsNull();
    public List<LiveStrtEndDto> findMstGoodsByPgmId(Long pgmId);
    public Long findCurrentPgm();
}
