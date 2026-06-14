package com.plateer.thingz.bo.service;

import com.plateer.thingz.bo.dto.PgmDto;

import java.util.List;

public interface PgmService {
    List<PgmDto> findAll();
    PgmDto findPgmById(Long id);
    List<PgmDto> findAllByEnd();
    List<PgmDto> findAllInFaq();
}
