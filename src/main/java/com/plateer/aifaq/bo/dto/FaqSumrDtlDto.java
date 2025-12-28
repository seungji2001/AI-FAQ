package com.plateer.aifaq.bo.dto;

import com.plateer.aifaq.bo.dto.base.BaseFaqSumrDtlDto;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@SuperBuilder
@AllArgsConstructor
public class FaqSumrDtlDto extends BaseFaqSumrDtlDto {
    private String intent;
}
