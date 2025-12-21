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

    /*
    * 진행중인 프로그램들 조회
    * */
    @GetMapping
    public ResponseEntity<List<PgmDto>> findAll() {
        return ResponseEntity.ok(pgmService.findAll());
    }

    /*
    * 종료된 프로그램들 조회
    * */
    @GetMapping("/ends")
    public ResponseEntity<List<PgmDto>> findAllByEnd() {
        return ResponseEntity.ok(pgmService.findAllByEnd());
    }

    /*
     * faq 요약 전송을 요청한 프로그램 조회
     * */
    @GetMapping("/faq")
    public ResponseEntity<List<PgmDto>> findAllInFaq() {
        return ResponseEntity.ok(pgmService.findAllInFaq());
    }
}
