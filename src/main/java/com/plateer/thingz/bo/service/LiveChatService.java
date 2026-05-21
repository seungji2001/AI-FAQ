package com.plateer.thingz.bo.service;

import com.plateer.thingz.bo.dto.FaqSumrDto;
import com.plateer.thingz.bo.dto.LiveChatInfo;

import java.util.List;

public interface LiveChatService {
    public List<LiveChatInfo> getChatHistory(FaqSumrDto faqSumrInfo);
}