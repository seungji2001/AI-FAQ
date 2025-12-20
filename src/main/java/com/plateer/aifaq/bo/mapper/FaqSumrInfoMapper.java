package com.plateer.aifaq.bo.mapper;

import com.plateer.aifaq.bo.dto.FaqSumrDto;
import com.plateer.aifaq.bo.dto.LiveStrtEndDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FaqSumrInfoMapper {
    void insertMstGoods(List<LiveStrtEndDto> liveStrtEndDtos);
    List<FaqSumrDto> findByLinkStatus(@Param("linkStatus") String linkStatus);
    void updateLinkStatus(FaqSumrDto faqSumrInfo);
}
