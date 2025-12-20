package com.plateer.aifaq.bo.service;

import com.plateer.aifaq.bo.dto.FaqSumrDto;
import com.plateer.aifaq.bo.dto.LiveStrtEndDto;

import java.util.List;

public interface FaqSumrInfoService {
    public void insertMstGoods(List<LiveStrtEndDto> liveStrtEndDtos);
    public List<FaqSumrDto> findWaitingItems();
    public void updateLinkStatus(FaqSumrDto faqSumrInfo);
}
