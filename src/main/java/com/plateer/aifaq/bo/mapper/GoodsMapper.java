package com.plateer.aifaq.bo.mapper;

import com.plateer.aifaq.bo.dto.GoodsDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface GoodsMapper {
    List<GoodsDto> findAll();
    GoodsDto findGoodsById(Long id);
}
