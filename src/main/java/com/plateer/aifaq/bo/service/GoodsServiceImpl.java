package com.plateer.aifaq.bo.service;

import com.plateer.aifaq.bo.dto.GoodsDto;
import com.plateer.aifaq.bo.enums.ErrorCode;
import com.plateer.aifaq.bo.exception.InvalidRequestException;
import com.plateer.aifaq.bo.exception.ResourceNotFoundException;
import com.plateer.aifaq.bo.mapper.GoodsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class GoodsServiceImpl implements GoodsService {

    private final GoodsMapper goodsMapper;

    @Cacheable(value = "goods", key = "'all'")
    @Override
    public List<GoodsDto> findAll(){
        List<GoodsDto> goodsDtos = goodsMapper.findAll();
        if(goodsDtos.isEmpty()){
            throw new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND);
        }
        return goodsDtos;
    }

    @Cacheable(value = "goods", key = "#id")
    @Override
    public GoodsDto findGoodsById(Long id) {
        if(id == null){
            throw new InvalidRequestException(ErrorCode.INVALID_REQUEST);
        }
        GoodsDto goodsDto = goodsMapper.findGoodsById(id);
        if(goodsDto == null){
            throw new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND);
        }
        return goodsDto;
    }
}
