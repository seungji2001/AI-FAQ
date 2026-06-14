package com.plateer.thingz.bo.mapper;

import com.plateer.thingz.bo.dto.FaqSumrDto;
import com.plateer.thingz.bo.dto.LiveChatInfo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface LiveChatMapper {
    List<LiveChatInfo> findByStartDtAndEndDt(FaqSumrDto liveSumrInfo);
}
