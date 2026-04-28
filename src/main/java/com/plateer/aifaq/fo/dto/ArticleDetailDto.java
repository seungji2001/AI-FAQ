package com.plateer.aifaq.fo.dto;

import com.plateer.aifaq.fo.entity.Article;
import lombok.Getter;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Getter
public class ArticleDetailDto {
    private final UUID id;
    private final String title;
    private final String content;
    private final String author;
    private final String authorAvatarUrl;
    private final String authorBio;
    private final Long authorFollowers;
    private final Integer authorArticles;
    private final String publishedAt;
    private final List<String> imageUrls;
    private final List<String> tags;
    private final ItemDto item;

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
    public static class ItemDto {
        private final Integer price;
        private final String condition;
        private final String tradeType;
        private final Boolean isSold;

        public ItemDto(com.plateer.aifaq.fo.entity.Item item) {
            this.price = item.getPrice();
            this.condition = item.getCondition();
            this.tradeType = item.getTradeType();
            this.isSold = item.getIsSold();
        }
    }
}
