package com.plateer.aifaq.bo.controller;

import com.plateer.aifaq.bo.dto.GoodsDto;
import com.plateer.aifaq.bo.service.GoodsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/goods")
@RequiredArgsConstructor
public class GoodsController {

    private final GoodsService goodsService;

    @GetMapping
    public ResponseEntity<List<GoodsDto>> findAll() {
        return ResponseEntity.ok(goodsService.findAll());
    }
}
