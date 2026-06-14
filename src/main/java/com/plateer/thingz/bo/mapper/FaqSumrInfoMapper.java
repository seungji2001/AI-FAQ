package com.plateer.thingz.bo.mapper;

import com.plateer.thingz.bo.dto.FaqSumrDto;
import com.plateer.thingz.bo.dto.GoodsDto;
import com.plateer.thingz.bo.dto.LiveStrtEndDto;
import com.plateer.thingz.bo.dto.request.FaqSumrRequestDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FaqSumrInfoMapper {
    int insertMstGoods(List<LiveStrtEndDto> liveStrtEndDtos);
    List<FaqSumrDto> findByLinkStatus(@Param("linkStatus") String linkStatus);
    int updateLinkStatus(FaqSumrDto faqSumrInfo);
    List<FaqSumrDto> findAllOrderByIdDesc(FaqSumrRequestDto faqSumrRequestDto);
    List<GoodsDto> findGoodsByFaqPgmId(Long faqPgmId);
}
