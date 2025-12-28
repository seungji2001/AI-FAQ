package com.plateer.aifaq.bo.mapper;

import com.plateer.aifaq.bo.dto.FaqSumrDto;
import com.plateer.aifaq.bo.dto.LiveChatInfo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface LiveChatMapper {
    List<LiveChatInfo> findByStartDtAndEndDt(FaqSumrDto liveSumrInfo);
}
