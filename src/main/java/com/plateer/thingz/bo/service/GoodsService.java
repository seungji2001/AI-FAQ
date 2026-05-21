package com.plateer.thingz.bo.service;

import com.plateer.thingz.bo.dto.GoodsDto;

import java.util.List;

public interface GoodsService {
    List<GoodsDto> findAll();
    GoodsDto findGoodsById(Long id);
}
