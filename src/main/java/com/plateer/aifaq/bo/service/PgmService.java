package com.plateer.aifaq.bo.service;

import com.plateer.aifaq.bo.dto.PgmDto;

import java.util.List;

public interface PgmService {
    List<PgmDto> findAll();
    PgmDto findPgmById(Long id);
}
