package com.plateer.aifaq.bo.service;

import com.plateer.aifaq.bo.dto.PgmDto;
import com.plateer.aifaq.bo.mapper.PgmMapper;
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
        return pgmMapper.findPgmById(id);
    }
}
