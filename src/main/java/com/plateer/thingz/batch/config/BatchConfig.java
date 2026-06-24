package com.plateer.thingz.batch.config;


import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableBatchProcessing
@ConditionalOnProperty(name = "thingz.batch.enabled", havingValue = "true")
public class BatchConfig {
}
