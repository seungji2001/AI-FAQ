package com.plateer.aifaq.bo.service;

import com.plateer.aifaq.bo.dto.GoodsDto;
import com.plateer.aifaq.bo.mapper.GoodsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class GoodsServiceImpl implements GoodsService {

    public final GoodsMapper goodsMapper;

    @Override
    public List<GoodsDto> findAll(){
        return goodsMapper.findAll();
    }

    @Override
    public GoodsDto findGoodsById(Long id) {
        return goodsMapper.findGoodsById(id);
    }
}
