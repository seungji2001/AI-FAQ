package com.plateer.aifaq.bo.service;

import com.plateer.aifaq.bo.dto.FaqSumrDto;
import com.plateer.aifaq.bo.dto.LiveStrtEndDto;
import com.plateer.aifaq.bo.mapper.FaqSumrInfoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class FaqSumrInfoServiceImpl implements FaqSumrInfoService {

    final private FaqSumrInfoMapper faqSumrInfoMapper;

    @Transactional
    @Override
    public void insertMstGoods(List<LiveStrtEndDto> liveStrtEndDtos) {
        faqSumrInfoMapper.insertMstGoods(liveStrtEndDtos);
    }

    @Override
    public List<FaqSumrDto> findWaitingItems() {
        return faqSumrInfoMapper.findByLinkStatus("W");
    }

    @Transactional
    @Override
    public void updateLinkStatus(FaqSumrDto faqSumrInfo) {
        faqSumrInfoMapper.updateLinkStatus(faqSumrInfo);
    }
}
