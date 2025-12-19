package com.plateer.aifaq;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.plateer.aifaq.bo.mapper")
public class AiFaqApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiFaqApplication.class, args);
    }

}
