package com.plateer.aifaq.bo.dto;

import com.plateer.aifaq.bo.dto.base.BaseFaqSumrDtlDto;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@SuperBuilder
public class FaqSumrDtlDto extends BaseFaqSumrDtlDto {
    private String intent;
}
