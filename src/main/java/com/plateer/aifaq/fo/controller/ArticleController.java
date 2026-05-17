package com.plateer.aifaq.fo.controller;

import com.plateer.aifaq.config.auth.CustomOAuth2User;
import com.plateer.aifaq.fo.dto.ArticleCreateRequest;
import com.plateer.aifaq.fo.dto.ArticleDetailDto;
import com.plateer.aifaq.fo.dto.ArticleListDto;
import com.plateer.aifaq.fo.dto.ArticleUpdateRequest;
import com.plateer.aifaq.fo.service.ArticleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Tag(name = "Article", description = "아티클 API")
@RestController
@RequestMapping("/api/fo/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;

    @Operation(summary = "인기 태그 조회", description = "발행된 아티클 기준 사용 횟수 상위 태그 이름 목록을 반환합니다.")
    @GetMapping("/tags/popular")
    public ResponseEntity<List<String>> getPopularTags(
            @Parameter(description = "반환할 태그 수 (기본 10)")
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(articleService.getPopularTags(limit));
    }

    @Operation(summary = "아티클 목록 조회", description = "발행된 아티클 전체 목록을 반환합니다.")
    @GetMapping
    public ResponseEntity<List<ArticleListDto>> getArticles(
            @Parameter(description = "태그명으로 필터 (예: 카메라)")
            @RequestParam(required = false) String tag) {
        if (tag != null && !tag.isBlank()) {
            return ResponseEntity.ok(articleService.getArticlesByTag(tag));
        }
        return ResponseEntity.ok(articleService.getArticles());
    }

    @Operation(summary = "내 임시저장 목록", description = "로그인한 유저의 임시저장 아티클 목록을 반환합니다.")
    @GetMapping("/me/drafts")
    public ResponseEntity<List<ArticleListDto>> getMyDrafts(
            @AuthenticationPrincipal CustomOAuth2User user) {
        return ResponseEntity.ok(articleService.getMyDrafts(user.getUserId()));
    }

    @Operation(summary = "아티클 상세 조회", description = "아티클 ID로 상세 정보를 반환합니다.",
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

    @Operation(summary = "수정용 아티클 조회", description = "본인 소유 아티클(발행/임시저장 모두)을 수정 목적으로 조회합니다.")
    @GetMapping("/{id}/edit")
    public ResponseEntity<ArticleDetailDto> getArticleForEdit(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomOAuth2User user) {
        return ResponseEntity.ok(articleService.getArticleForEdit(id, user.getUserId()));
    }

    @Operation(summary = "아티클 작성", description = "새 아티클을 작성합니다. isPublished=false이면 임시저장, true이면 즉시발행입니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "작성 성공"),
            @ApiResponse(responseCode = "400", description = "입력값 오류"),
            @ApiResponse(responseCode = "404", description = "유저 없음")
        }
    )
    @PostMapping
    public ResponseEntity<Map<String, UUID>> createArticle(
            @Valid @RequestBody ArticleCreateRequest request,
            @AuthenticationPrincipal CustomOAuth2User user) {
        UUID id = articleService.createArticle(request, user.getUserId());
        return ResponseEntity.ok(Map.of("id", id));
    }

    @Operation(summary = "아티클 수정", description = "아티클 내용을 수정합니다.",
        responses = {
            @ApiResponse(responseCode = "204", description = "수정 성공"),
            @ApiResponse(responseCode = "404", description = "아티클 없음 또는 권한 없음")
        }
    )
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateArticle(
            @PathVariable UUID id,
            @Valid @RequestBody ArticleUpdateRequest request,
            @AuthenticationPrincipal CustomOAuth2User user) {
        articleService.updateArticle(id, request, user.getUserId());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "아티클 삭제",
        responses = {
            @ApiResponse(responseCode = "204", description = "삭제 성공"),
            @ApiResponse(responseCode = "404", description = "아티클 없음 또는 권한 없음")
        }
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomOAuth2User user) {
        articleService.deleteArticle(id, user.getUserId());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "아티클 발행", description = "임시저장 아티클을 발행 상태로 전환합니다.",
        responses = {
            @ApiResponse(responseCode = "204", description = "발행 성공"),
            @ApiResponse(responseCode = "400", description = "이미 발행된 아티클"),
            @ApiResponse(responseCode = "404", description = "아티클 없음 또는 권한 없음")
        }
    )
    @PatchMapping("/{id}/publish")
    public ResponseEntity<Void> publishArticle(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomOAuth2User user) {
        articleService.publishArticle(id, user.getUserId());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "판매 완료 처리", description = "아티클의 판매 상품을 판매 완료로 변경합니다.",
        responses = {
            @ApiResponse(responseCode = "204", description = "처리 성공"),
            @ApiResponse(responseCode = "400", description = "판매 상품 없음 또는 이미 판매 완료"),
            @ApiResponse(responseCode = "404", description = "아티클 없음")
        }
    )
    @PatchMapping("/{id}/item/sold")
    public ResponseEntity<Void> markItemAsSold(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomOAuth2User user) {
        articleService.markItemAsSold(id, user.getUserId());
        return ResponseEntity.noContent().build();
    }
}
