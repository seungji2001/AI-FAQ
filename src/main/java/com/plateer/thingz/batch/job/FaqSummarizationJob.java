package com.plateer.thingz.batch.job;

import com.plateer.thingz.batch.tasklet.AiSummarizationTasklet;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Slf4j
@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(name = "thingz.batch.enabled", havingValue = "true")
public class FaqSummarizationJob {
    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final AiSummarizationTasklet aiSummarizationTasklet;

    @Bean
    public Job faqAiSummarizationJob() {
        return new JobBuilder("faqAiSummarizationJob", jobRepository)
                .start(faqSummarizationStep())
                .build();
    }

    @Bean
    public Step faqSummarizationStep() {
        return new StepBuilder("faqSummrizationStep", jobRepository)
                .tasklet(aiSummarizationTasklet, transactionManager)
                .build();
    }
}
