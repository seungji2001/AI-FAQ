package com.plateer.aifaq.fo.dto;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.plateer.aifaq.fo.entity.Article;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
@Schema(description = "아티클 목록 아이템")
public class ArticleListDto {

    @Schema(description = "아티클 UUID")
    private UUID id;

    @Schema(description = "제목")
    private String title;

    @Schema(description = "작성자 username")
    private String author;

    @Schema(description = "커버 이미지 URL (첫번째 이미지)")
    private String coverUrl;

    @Schema(description = "태그 목록")
    private List<String> tags;

    @Schema(description = "판매 가격 (판매 글이 아니면 null)")
    private Integer price;

    public ArticleListDto(Article article) {
        this.id = article.getId();
        this.title = article.getTitle();
        this.author = article.getUser().getUsername();
        this.coverUrl = article.getImages().stream()
                .filter(i -> i.getOrderIndex() == 0)
                .findFirst()
                .map(i -> i.getUrl())
                .orElse(null);
        this.tags = article.getArticleTags().stream()
                .map(at -> "#" + at.getTag().getName())
                .toList();
        this.price = article.getItem() != null ? article.getItem().getPrice() : null;
    }
}
