package com.plateer.thingz.bo.service;

import com.plateer.thingz.bo.dto.PgmDto;
import com.plateer.thingz.bo.enums.ErrorCode;
import com.plateer.thingz.bo.exception.InvalidRequestException;
import com.plateer.thingz.bo.exception.ResourceNotFoundException;
import com.plateer.thingz.bo.mapper.PgmMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PgmServiceImpl implements PgmService {

    private final PgmMapper pgmMapper;

    @Override
    public List<PgmDto> findAll() {
        return pgmMapper.findAll();
    }

    @Override
    public PgmDto findPgmById(Long id) {
        PgmDto pgmDto = pgmMapper.findPgmById(id);
        if(pgmDto == null){
            throw new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND);
        }
        return pgmDto;
    }

    @Override
    public List<PgmDto> findAllByEnd() {
        return pgmMapper.findAllByEnd();
    }

    @Override
    public List<PgmDto> findAllInFaq() {
        return pgmMapper.findAllInFaq();
    }
}
