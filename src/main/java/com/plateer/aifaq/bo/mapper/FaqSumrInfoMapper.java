package com.plateer.aifaq.bo.mapper;

import com.plateer.aifaq.bo.dto.FaqSumrInfo;
import com.plateer.aifaq.bo.dto.LiveStrtEndDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FaqSumrInfoMapper {
    void insertMstGoods(List<LiveStrtEndDto> liveStrtEndDtos);
    List<FaqSumrInfo> findByLinkStatus(@Param("linkStatus") String linkStatus);
    int updateLinkStatus(@Param("id") Long id, @Param("linkStatus") String linkStatus);
}
