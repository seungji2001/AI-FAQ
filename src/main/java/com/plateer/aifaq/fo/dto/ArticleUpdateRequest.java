package com.plateer.aifaq.fo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@Schema(description = "아티클 수정 요청")
public class ArticleUpdateRequest {

    @NotBlank(message = "제목은 필수입니다")
    @Size(max = 200, message = "제목은 200자 이내여야 합니다")
    @Schema(description = "아티클 제목")
    private String title;

    @NotBlank(message = "본문은 필수입니다")
    @Schema(description = "아티클 본문")
    private String content;

    @Schema(description = "태그 목록")
    private List<String> tags;

    @Schema(description = "이미지 URL 목록")
    private List<String> imageUrls;

    @Schema(description = "판매 정보")
    private ItemRequest item;

    @Getter
    @NoArgsConstructor
    @Schema(description = "판매 물건 정보")
    public static class ItemRequest {
        private boolean forSale;
        private Integer price;
        private String condition;
        private String tradeType;
    }
}
