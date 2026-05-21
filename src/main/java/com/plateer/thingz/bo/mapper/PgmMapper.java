package com.plateer.thingz.bo.mapper;

import com.plateer.thingz.bo.dto.GoodsDto;
import com.plateer.thingz.bo.dto.PgmDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PgmMapper {
    List<PgmDto> findAll();
    PgmDto findPgmById(Long id);
    List<PgmDto> findAllByEnd();
    List<PgmDto> findAllInFaq();
}
