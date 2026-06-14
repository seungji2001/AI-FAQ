package com.plateer.thingz.bo.dto.base;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.Date;

@Data
@NoArgsConstructor
@SuperBuilder
public class BaseLiveStrtEndDto {
    private Long id;
    private Long goodsId;
    private Long pgmId;
    private Date strtDt;
    private Date endDt;
    private Integer seq;
}
