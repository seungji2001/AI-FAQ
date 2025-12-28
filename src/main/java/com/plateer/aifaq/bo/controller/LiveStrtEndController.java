package com.plateer.aifaq.bo.controller;

import com.plateer.aifaq.bo.dto.GoodsDto;
import com.plateer.aifaq.bo.dto.LiveStrtEndDto;
import com.plateer.aifaq.bo.dto.PgmDto;
import com.plateer.aifaq.bo.dto.request.PgmGoodsRequestDto;
import com.plateer.aifaq.bo.service.FaqSumrInfoService;
import com.plateer.aifaq.bo.service.GoodsService;
import com.plateer.aifaq.bo.service.LiveStrtEndService;
import com.plateer.aifaq.bo.service.PgmService;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.annotations.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/live-start-end")
@RequiredArgsConstructor
public class LiveStrtEndController {

    private final LiveStrtEndService liveStrtEndService;
    private final PgmService pgmService;
    private final GoodsService goodsService;
    private final FaqSumrInfoService faqSumrInfoService;

    @PostMapping("/insert")
    public ResponseEntity<LiveStrtEndDto> insert(@RequestBody PgmGoodsRequestDto pgmGoodsRequestDto) {
        // 프로그램이 진행중이어야한다
        PgmDto pgmDto = pgmService.findPgmById(pgmGoodsRequestDto.getPgmId());

        // 방송중인 프로그램이 있을 경우 종료 후 새로운 프로그램 시작이 가능하다
        liveStrtEndService.findLiveStrtEndsEndDateIsNull();

        // 프로그램 아이디중 가장 큰 seq를 찾는다
        Integer maxSeq = liveStrtEndService.maxSeq(pgmGoodsRequestDto.getPgmId()).orElse(0) + 1;
        Set<Long> goodsIdNotExist = new HashSet<>();
        List<LiveStrtEndDto> liveStrtEndDtos = new ArrayList<>();
        for(Long goodsId : pgmGoodsRequestDto.getGoodsId()){
            GoodsDto goodsDto = goodsService.findGoodsById(goodsId);
            if(goodsDto == null){
                goodsIdNotExist.add(goodsId);
                continue;
            }
            LiveStrtEndDto livestrtEndDto = LiveStrtEndDto.builder()
                    .pgmId(pgmGoodsRequestDto.getPgmId())
                    .goodsId(goodsId)
                    .seq(maxSeq)
                    .build();
            liveStrtEndDtos.add(livestrtEndDto);
        }

        int liveStrtEndId = liveStrtEndService.insertBatch(liveStrtEndDtos);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/program/{pgmId}")
    public ResponseEntity<List<LiveStrtEndDto>> getByProgramId(@PathVariable Long pgmId) {
        List<LiveStrtEndDto> list = liveStrtEndService.findLiveStrtEndsByPgmId(pgmId);
        return ResponseEntity.ok(list);
    }

    @PutMapping("/program/{pgmId}/fin")
    public ResponseEntity<Boolean> updateEndDateBypgmIdAndSeq(@PathVariable Long pgmId) {
        liveStrtEndService.updateEndDateBypgmIdAndSeq(pgmId);
        return ResponseEntity.ok(true);
    }

    @GetMapping("/program/{pgmId}/mst-goods")
    public ResponseEntity<List<LiveStrtEndDto>> findMstGoodsByPgmId(@PathVariable Long pgmId) {
        List<LiveStrtEndDto> liveStrtEndDtos = liveStrtEndService.findMstGoodsByPgmId(pgmId);
        if(liveStrtEndDtos.isEmpty()){
            throw new IllegalArgumentException("삽입할 대상 방송상품이 없습니다.");
        }
        faqSumrInfoService.insertMstGoods(liveStrtEndDtos);
        return ResponseEntity.ok(liveStrtEndDtos);
    }

    @GetMapping("/current")
    public ResponseEntity<Long> findCurrentPgm() {
        Long pgmId = liveStrtEndService.findCurrentPgm();
        return ResponseEntity.ok(pgmId);
    }
}
