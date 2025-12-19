package com.plateer.aifaq.bo.mapper;

import com.plateer.aifaq.bo.dto.PgmDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PgmMapper {
    List<PgmDto> findAll();
    PgmDto findPgmById(Long id);
}
