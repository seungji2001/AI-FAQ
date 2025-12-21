package com.plateer.aifaq.bo.service;

import com.plateer.aifaq.bo.dto.FaqSumrDto;
import com.plateer.aifaq.bo.dto.GoodsDto;
import com.plateer.aifaq.bo.dto.LiveStrtEndDto;
import com.plateer.aifaq.bo.dto.request.FaqSumrDtlRequestDto;
import com.plateer.aifaq.bo.dto.request.FaqSumrRequestDto;

import java.util.List;

public interface FaqSumrInfoService {
    public void insertMstGoods(List<LiveStrtEndDto> liveStrtEndDtos);
    public List<FaqSumrDto> findWaitingItems();
    public void updateLinkStatus(FaqSumrDto faqSumrInfo);
    public List<FaqSumrDto> findAllOrderByIdDesc(FaqSumrRequestDto faqSumrRequestDto);
    List<GoodsDto> findGoodsByFaqPgmId(Long faqPgmId);
}
