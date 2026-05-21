package com.plateer.thingz;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@MapperScan({"com.plateer.thingz.bo.mapper"})
@EnableScheduling
public class AiFaqApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiFaqApplication.class, args);
    }

}
