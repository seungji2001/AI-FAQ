package com.plateer.thingz.batch.tasklet;

import com.plateer.thingz.bo.dto.FaqSumrDto;
import com.plateer.thingz.batch.service.FaqSummarizationService;
import com.plateer.thingz.bo.service.FaqSumrInfoService;
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

    private final FaqSumrInfoService faqSumrService;
    private final FaqSummarizationService faqProcessingFacade;

    @Override
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) {
        List<FaqSumrDto> waitingList = faqSumrService.findWaitingItems();

        for (FaqSumrDto faqItem : waitingList) {
            faqProcessingFacade.processFaqItem(faqItem);
        }

        return RepeatStatus.FINISHED;
    }
}