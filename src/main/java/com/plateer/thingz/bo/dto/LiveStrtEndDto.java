package com.plateer.thingz.bo.dto;

import com.plateer.thingz.bo.dto.base.BaseLiveStrtEndDto;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@SuperBuilder
public class LiveStrtEndDto extends BaseLiveStrtEndDto {
    private String goodsNm;
    private String pgmNm;
}
