package com.plateer.aifaq.bo.mapper;

import com.plateer.aifaq.bo.dto.FaqSumrDto;
import com.plateer.aifaq.bo.dto.GoodsDto;
import com.plateer.aifaq.bo.dto.LiveStrtEndDto;
import com.plateer.aifaq.bo.dto.request.FaqSumrRequestDto;
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
