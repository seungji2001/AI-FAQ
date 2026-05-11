package com.plateer.aifaq.fo.dto;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.plateer.aifaq.fo.entity.Article;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class ArticleDetailDto {
    private UUID id;
    private String title;
    private String content;
    private String author;
    private String authorAvatarUrl;
    private String authorBio;
    private Long authorFollowers;
    private Integer authorArticles;
    private String publishedAt;
    private List<String> imageUrls;
    private List<String> tags;
    private ItemDto item;

    public ArticleDetailDto(Article article, Long followerCount) {
        this.id = article.getId();
        this.title = article.getTitle();
        this.content = article.getContent();
        this.author = article.getUser().getUsername();
        this.authorAvatarUrl = article.getUser().getAvatarUrl();
        this.authorBio = article.getUser().getBio();
        this.authorFollowers = followerCount;
        this.authorArticles = article.getUser().getArticles().size();
        this.publishedAt = article.getPublishedAt() != null
                ? article.getPublishedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd"))
                : null;
        this.imageUrls = article.getImages().stream()
                .map(i -> i.getUrl())
                .toList();
        this.tags = article.getArticleTags().stream()
                .map(at -> "#" + at.getTag().getName())
                .toList();
        this.item = article.getItem() != null ? new ItemDto(article.getItem()) : null;
    }

    @Getter
    @NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
    @JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
    public static class ItemDto {
        private Integer price;
        private String condition;
        private String tradeType;
        private Boolean isSold;

        public ItemDto(com.plateer.aifaq.fo.entity.Item item) {
            this.price = item.getPrice();
            this.condition = item.getCondition();
            this.tradeType = item.getTradeType();
            this.isSold = item.getIsSold();
        }
    }
}
