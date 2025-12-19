package com.plateer.aifaq.bo.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PgmGoodsRequestDto {
    private Long pgmId;
    private List<Long> goodsId;
    private Integer seq;
}
