package com.plateer.thingz.bo.controller;

import com.plateer.thingz.bo.dto.GoodsDto;
import com.plateer.thingz.bo.service.GoodsService;
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
