package com.plateer.aifaq.fo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Getter
@NoArgsConstructor
@Schema(description = "아티클 작성 요청")
public class ArticleCreateRequest {

    @NotNull(message = "작성자 ID는 필수입니다")
    @Schema(description = "작성자 UUID", example = "00000000-0000-0000-0000-000000000001")
    private UUID userId;

    @NotBlank(message = "제목은 필수입니다")
    @Size(max = 200, message = "제목은 200자 이내여야 합니다")
    @Schema(description = "아티클 제목", example = "10년 된 라이카 M6, 새 주인을 찾습니다")
    private String title;

    @NotBlank(message = "본문은 필수입니다")
    @Schema(description = "아티클 본문")
    private String content;

    @Schema(description = "발행 여부 (false=임시저장, true=즉시발행)", example = "false")
    private boolean isPublished = false;

    @Schema(description = "태그 목록 (#포함 또는 미포함 모두 허용)", example = "[\"#빈티지\", \"카메라\"]")
    private List<String> tags;

    @Schema(description = "이미지 URL 목록 (첫번째가 커버 이미지)", example = "[\"https://...\"]")
    private List<String> imageUrls;

    @Schema(description = "판매 정보 (판매 안 함이면 forSale=false)")
    private ItemRequest item;

    @Getter
    @NoArgsConstructor
    @Schema(description = "판매 물건 정보")
    public static class ItemRequest {

        @Schema(description = "판매 여부", example = "true")
        private boolean forSale;

        @Schema(description = "가격 (원)", example = "650000")
        private Integer price;

        @Schema(description = "물건 상태 (S/A/B/C)", example = "A")
        private String condition;

        @Schema(description = "거래 방식 (택배/직거래/협의)", example = "택배")
        private String tradeType;
    }
}
