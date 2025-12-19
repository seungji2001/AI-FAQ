package com.plateer.aifaq.bo.service;

import com.plateer.aifaq.bo.dto.GoodsDto;

import java.util.List;

public interface GoodsService {
    List<GoodsDto> findAll();
    GoodsDto findGoodsById(Long id);
}
