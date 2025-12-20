package com.plateer.aifaq.bo.mapper;

import com.plateer.aifaq.bo.dto.FaqSumrInfo;
import com.plateer.aifaq.bo.dto.LiveChatInfo;
import com.plateer.aifaq.bo.dto.LiveStrtEndDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface LiveChatMapper {
    List<LiveChatInfo> findByStartDtAndEndDt(FaqSumrInfo liveSumrInfo);
}
