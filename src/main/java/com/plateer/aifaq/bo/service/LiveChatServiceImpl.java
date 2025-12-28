package com.plateer.aifaq.bo.service;

import com.plateer.aifaq.bo.dto.FaqSumrDto;
import com.plateer.aifaq.bo.dto.LiveChatInfo;
import com.plateer.aifaq.bo.enums.ErrorCode;
import com.plateer.aifaq.bo.exception.InvalidRequestException;
import com.plateer.aifaq.bo.exception.ResourceNotFoundException;
import com.plateer.aifaq.bo.mapper.LiveChatMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class LiveChatServiceImpl implements LiveChatService {

    private final LiveChatMapper liveChatMapper;

    public List<LiveChatInfo> getChatHistory(FaqSumrDto faqSumrInfo) {
        if (faqSumrInfo == null) {
            throw new InvalidRequestException(ErrorCode.INVALID_REQUEST);
        }
        List<LiveChatInfo> liveChatInfos = liveChatMapper.findByStartDtAndEndDt(faqSumrInfo);
        if(liveChatInfos.isEmpty()){
            throw new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND);
        }
        return liveChatInfos;
    }
}