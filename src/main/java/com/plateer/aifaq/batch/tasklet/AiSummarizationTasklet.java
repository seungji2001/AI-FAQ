package com.plateer.aifaq.batch.tasklet;

import com.plateer.aifaq.bo.dto.FaqSumrInfo;
import com.plateer.aifaq.bo.dto.LiveChatInfo;
import com.plateer.aifaq.bo.mapper.FaqSumrInfoMapper;
import com.plateer.aifaq.bo.mapper.LiveChatMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class AiSummarizationTasklet implements Tasklet {

    private final FaqSumrInfoMapper faqSumrInfoMapper;
    private final LiveChatMapper liveChatMapper;

    @Override
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
        log.info("=== DB 조회 배치 시작 ===");

        // 1. 대기 중인 데이터 조회
        List<FaqSumrInfo> waitingList = faqSumrInfoMapper.findByLinkStatus("W");

        log.info("조회된 데이터 개수: {}", waitingList.size());

        // 2. 각 데이터 출력
        for (FaqSumrInfo faq : waitingList) {
            log.info("ID: {}, PGM_ID: {}, GOODS_ID: {}, STATUS: {}",
                    faq.getId(), faq.getPgmId(), faq.getGoodsId(), faq.getLinkStatus());
            //3. 데이터 해당 livechat 가지고 오기
            List<LiveChatInfo> liveChatInfo = liveChatMapper.findByStartDtAndEndDt(faq);
        }

        log.info("=== DB 조회 배치 완료 ===");

        return RepeatStatus.FINISHED;
    }
}
