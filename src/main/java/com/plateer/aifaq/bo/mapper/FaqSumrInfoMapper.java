package com.plateer.aifaq.bo.mapper;

import com.plateer.aifaq.bo.dto.LiveStrtEndDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface FaqSumrInfoMapper {
    void insertMstGoods(List<LiveStrtEndDto> liveStrtEndDtos);
}
