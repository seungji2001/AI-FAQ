package com.plateer.aifaq.bo.service;

import com.plateer.aifaq.bo.dto.FaqSumrDto;
import com.plateer.aifaq.bo.dto.LiveChatInfo;

import java.util.List;

public interface LiveChatService {
    public List<LiveChatInfo> getChatHistory(FaqSumrDto faqSumrInfo);
}