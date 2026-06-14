package com.plateer.thingz.bo.service;

import com.plateer.thingz.bo.dto.GoodsDto;
import com.plateer.thingz.bo.enums.ErrorCode;
import com.plateer.thingz.bo.exception.InvalidRequestException;
import com.plateer.thingz.bo.exception.ResourceNotFoundException;
import com.plateer.thingz.bo.mapper.GoodsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class GoodsServiceImpl implements GoodsService {

    private final GoodsMapper goodsMapper;

    @Override
    public List<GoodsDto> findAll(){
        List<GoodsDto> goodsDtos = goodsMapper.findAll();
        if(goodsDtos.isEmpty()){
            throw new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND);
        }
        return goodsDtos;
    }

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
