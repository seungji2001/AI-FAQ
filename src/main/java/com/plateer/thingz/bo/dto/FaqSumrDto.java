package com.plateer.thingz.bo.dto;

import com.plateer.thingz.bo.dto.base.BaseFaqSumrDto;
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
public class FaqSumrDto extends BaseFaqSumrDto {
}
