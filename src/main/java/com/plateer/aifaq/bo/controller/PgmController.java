package com.plateer.aifaq.bo.controller;

import com.plateer.aifaq.bo.dto.PgmDto;
import com.plateer.aifaq.bo.service.PgmServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/programs")
@RequiredArgsConstructor
public class PgmController {
    private final PgmServiceImpl pgmService;

    @GetMapping
    public ResponseEntity<List<PgmDto>> findAll() {
        return ResponseEntity.ok(pgmService.findAll());
    }
}
