package com.plateer.aifaq.bo.mapper;

import com.plateer.aifaq.bo.dto.LiveStrtEndDto;
import com.plateer.aifaq.bo.dto.request.PgmGoodsRequestDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper
public interface LiveStrtEndMapper {
    public Optional<Integer> maxSeqGroupByPgmId(Long pgmId);
    public int insertBatch(List<LiveStrtEndDto> liveStrtEndDto);
    public int updateEndDateBypgmIdAndSeq(Long pgmId);
    public List<LiveStrtEndDto> findLiveStrtEndsByPgmId(Long pgmId);
    public int findLiveStrtEndsEndDateIsNull();
    public List<LiveStrtEndDto> findMstGoodsByPgmId(Long pgmId);
    public Long findCurrentPgm();
}
