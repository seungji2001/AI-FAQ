package com.plateer.aifaq.bo.service;

import com.plateer.aifaq.bo.dto.PgmDto;
import com.plateer.aifaq.bo.enums.ErrorCode;
import com.plateer.aifaq.bo.exception.InvalidRequestException;
import com.plateer.aifaq.bo.exception.ResourceNotFoundException;
import com.plateer.aifaq.bo.mapper.PgmMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PgmServiceImpl implements PgmService {

    private final PgmMapper pgmMapper;

    @Cacheable(value = "pgm", key = "'all'")
    @Override
    public List<PgmDto> findAll() {
        return pgmMapper.findAll();
    }

    @Cacheable(value = "pgm", key = "#id")
    @Override
    public PgmDto findPgmById(Long id) {
        PgmDto pgmDto = pgmMapper.findPgmById(id);
        if(pgmDto == null){
            throw new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND);
        }
        return pgmDto;
    }

    @Cacheable(value = "pgm", key = "'ended'")
    @Override
    public List<PgmDto> findAllByEnd() {
        return pgmMapper.findAllByEnd();
    }

    @Cacheable(value = "pgm", key = "'inFaq'")
    @Override
    public List<PgmDto> findAllInFaq() {
        return pgmMapper.findAllInFaq();
    }
}
