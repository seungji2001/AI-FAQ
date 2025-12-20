package com.plateer.aifaq.bo.dto.base;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@SuperBuilder
public class BaseFaqSumrDtlDto {
    private Long id;
    private Long faqId;
    private String questCont;
    private String ansCont;
    private String dispYn;
}
