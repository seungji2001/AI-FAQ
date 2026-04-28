package com.plateer.aifaq.fo.controller;

import com.plateer.aifaq.fo.dto.ArticleCreateRequest;
import com.plateer.aifaq.fo.dto.ArticleDetailDto;
import com.plateer.aifaq.fo.dto.ArticleListDto;
import com.plateer.aifaq.fo.service.ArticleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Tag(name = "Article", description = "아티클 API")
@RestController
@RequestMapping("/api/fo/articles")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ArticleController {

    private final ArticleService articleService;

    @Operation(
        summary = "아티클 목록 조회",
        description = "발행된 아티클 전체 목록을 반환합니다. 메인 피드에서 사용됩니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "조회 성공",
                content = @Content(schema = @Schema(implementation = ArticleListDto.class)))
        }
    )
    @GetMapping
    public ResponseEntity<List<ArticleListDto>> getArticles() {
        return ResponseEntity.ok(articleService.getArticles());
    }

    @Operation(
        summary = "아티클 상세 조회",
        description = "아티클 ID로 상세 정보를 반환합니다. 이미지, 태그, 판매 정보, 작성자 정보를 포함합니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "조회 성공",
                content = @Content(schema = @Schema(implementation = ArticleDetailDto.class))),
            @ApiResponse(responseCode = "404", description = "아티클 없음")
        }
    )
    @GetMapping("/{id}")
    public ResponseEntity<ArticleDetailDto> getArticle(
            @Parameter(description = "아티클 UUID", required = true) @PathVariable UUID id) {
        return ResponseEntity.ok(articleService.getArticle(id));
    }

    @Operation(
        summary = "아티클 작성",
        description = "새 아티클을 작성합니다. isPublished=false이면 임시저장, true이면 발행입니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "작성 성공 - 생성된 아티클 ID 반환"),
            @ApiResponse(responseCode = "404", description = "유저 없음")
        }
    )
    @PostMapping
    public ResponseEntity<Map<String, UUID>> createArticle(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "아티클 작성 요청 본문",
                required = true,
                content = @Content(schema = @Schema(implementation = ArticleCreateRequest.class))
            )
            @RequestBody ArticleCreateRequest request) {
        UUID id = articleService.createArticle(request);
        return ResponseEntity.ok(Map.of("id", id));
    }
}
