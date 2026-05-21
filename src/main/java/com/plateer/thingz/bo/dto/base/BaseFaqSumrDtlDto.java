package com.plateer.thingz.bo.dto.base;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@SuperBuilder
@AllArgsConstructor
public class BaseFaqSumrDtlDto {
    private Long id;
    private Long faqId;
    private String questCont;
    private String ansCont;
    private String dispYn;
}
