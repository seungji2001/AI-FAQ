package com.plateer.thingz.bo.service;

import com.plateer.thingz.bo.dto.FaqSumrDto;
import com.plateer.thingz.bo.dto.GoodsDto;
import com.plateer.thingz.bo.dto.LiveStrtEndDto;
import com.plateer.thingz.bo.dto.request.FaqSumrDtlRequestDto;
import com.plateer.thingz.bo.dto.request.FaqSumrRequestDto;

import java.util.List;

public interface FaqSumrInfoService {
    public void insertMstGoods(List<LiveStrtEndDto> liveStrtEndDtos);
    public List<FaqSumrDto> findWaitingItems();
    public void updateLinkStatus(FaqSumrDto faqSumrInfo);
    public List<FaqSumrDto> findAllOrderByIdDesc(FaqSumrRequestDto faqSumrRequestDto);
    List<GoodsDto> findGoodsByFaqPgmId(Long faqPgmId);
}
