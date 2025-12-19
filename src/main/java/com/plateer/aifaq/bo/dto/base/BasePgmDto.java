package com.plateer.aifaq.bo.dto.base;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class BasePgmDto {
    private Long id;
    private String pgmNm;
    private Date strtDt;
    private Date endDt;
}
