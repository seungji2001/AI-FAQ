package com.plateer.aifaq.bo.dto.base;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BaseGoodsDto {
    private Long id;
    private String goodsNm;
    private Integer price;
}
