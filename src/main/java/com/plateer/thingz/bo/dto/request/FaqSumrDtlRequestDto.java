package com.plateer.thingz.bo.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FaqSumrDtlRequestDto {
    private String dispYn;
    private Long faqDtlId;
}
