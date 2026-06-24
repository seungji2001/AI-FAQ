package com.plateer.thingz.batch.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "thingz.batch.enabled", havingValue = "true")
public class FaqSummarizationScheduler {

    private final JobLauncher jobLauncher;
    private final Job faqAiSummarizationJob;

    // 매일 새벽 2시에 자동 실행
    //@Scheduled(cron = "0 55 21 * * *")
    public void runFaqSummarization() {
        try {
            log.info("FAQ 요약 배치 자동 실행 시작");

            JobParameters jobParameters = new JobParametersBuilder()
                    .addLong("timestamp", System.currentTimeMillis())
                    .toJobParameters();

            jobLauncher.run(faqAiSummarizationJob, jobParameters);

            log.info("FAQ 요약 배치 자동 실행 완료");
        } catch (Exception e) {
            log.error("FAQ 요약 배치 자동 실행 실패", e);
        }
    }
}
