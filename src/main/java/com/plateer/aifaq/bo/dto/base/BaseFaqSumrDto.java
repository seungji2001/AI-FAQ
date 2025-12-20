package com.plateer.aifaq.bo.dto.base;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@SuperBuilder
public class BaseFaqSumrDto {
    private Long id;
    private Long pgmId;
    private Long goodsId;
    private Long liveStartEndId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String linkStatus; //todo enum으로 리팩토링
}
