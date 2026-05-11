package com.plateer.aifaq.fo.service;

import com.plateer.aifaq.fo.dto.ArticleCreateRequest;
import com.plateer.aifaq.fo.dto.ArticleDetailDto;
import com.plateer.aifaq.fo.dto.ArticleListDto;
import com.plateer.aifaq.fo.dto.ArticleUpdateRequest;
import com.plateer.aifaq.fo.entity.*;
import com.plateer.aifaq.fo.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final FollowRepository followRepository;
    private final ItemRepository itemRepository;

    @Cacheable(value = "articles", key = "'all'")
    public List<ArticleListDto> getArticles() {
        return articleRepository.findPublishedArticles().stream()
                .map(ArticleListDto::new)
                .toList();
    }

    @Cacheable(value = "articles", key = "#id")
    public ArticleDetailDto getArticle(UUID id) {
        Article article = articleRepository.findPublishedById(id)
                .orElseThrow(() -> new EntityNotFoundException("Article not found: " + id));
        long followerCount = followRepository.countByFollowing(article.getUser());
        return new ArticleDetailDto(article, followerCount);
    }

    @Cacheable(value = "articles", key = "'tag:' + #tagName")
    public List<ArticleListDto> getArticlesByTag(String tagName) {
        return articleRepository.findByTagName(tagName).stream()
                .map(ArticleListDto::new)
                .toList();
    }

    @Cacheable(value = "articles", key = "'user:' + #userId")
    public List<ArticleListDto> getArticlesByUser(UUID userId) {
        return articleRepository.findPublishedByUserId(userId).stream()
                .map(ArticleListDto::new)
                .toList();
    }

    public List<ArticleListDto> getMyDrafts(UUID userId) {
        return articleRepository.findDraftsByUserId(userId).stream()
                .map(ArticleListDto::new)
                .toList();
    }

    public ArticleDetailDto getArticleForEdit(UUID id, UUID userId) {
        Article article = articleRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new EntityNotFoundException("Article not found or access denied"));
        long followerCount = followRepository.countByFollowing(article.getUser());
        return new ArticleDetailDto(article, followerCount);
    }

    @CacheEvict(value = "articles", allEntries = true)
    @Transactional
    public UUID createArticle(ArticleCreateRequest request, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));

        Article article = Article.builder()
                .user(user)
                .title(request.getTitle())
                .content(request.getContent())
                .build();

        if (Boolean.TRUE.equals(request.getIsPublished())) {
            article.publish();
        }

        if (request.getImageUrls() != null) {
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                ArticleImage image = ArticleImage.builder()
                        .article(article)
                        .url(request.getImageUrls().get(i))
                        .orderIndex(i)
                        .build();
                article.getImages().add(image);
            }
        }

        if (request.getTags() != null) {
            for (String tagName : request.getTags()) {
                String name = tagName.startsWith("#") ? tagName.substring(1) : tagName;
                Tag tag = tagRepository.findByName(name)
                        .orElseGet(() -> tagRepository.save(Tag.builder().name(name).build()));
                ArticleTag articleTag = ArticleTag.builder().article(article).tag(tag).build();
                article.getArticleTags().add(articleTag);
            }
        }

        articleRepository.save(article);

        if (request.getItem() != null && request.getItem().isForSale()) {
            Item item = Item.builder()
                    .article(article)
                    .price(request.getItem().getPrice())
                    .condition(request.getItem().getCondition())
                    .tradeType(request.getItem().getTradeType())
                    .build();
            itemRepository.save(item);
        }

        return article.getId();
    }

    @CacheEvict(value = "articles", allEntries = true)
    @Transactional
    public void publishArticle(UUID id, UUID userId) {
        Article article = articleRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new EntityNotFoundException("Article not found or access denied"));
        if (article.getIsPublished()) {
            throw new IllegalArgumentException("이미 발행된 아티클입니다.");
        }
        article.publish();
    }

    @CacheEvict(value = "articles", allEntries = true)
    @Transactional
    public void updateArticle(UUID id, ArticleUpdateRequest request, UUID userId) {
        Article article = articleRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new EntityNotFoundException("Article not found or access denied"));

        article.updateContent(request.getTitle(), request.getContent());

        article.getImages().clear();
        if (request.getImageUrls() != null) {
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                ArticleImage image = ArticleImage.builder()
                        .article(article)
                        .url(request.getImageUrls().get(i))
                        .orderIndex(i)
                        .build();
                article.getImages().add(image);
            }
        }

        article.getArticleTags().clear();
        if (request.getTags() != null) {
            for (String tagName : request.getTags()) {
                String name = tagName.startsWith("#") ? tagName.substring(1) : tagName;
                Tag tag = tagRepository.findByName(name)
                        .orElseGet(() -> tagRepository.save(Tag.builder().name(name).build()));
                ArticleTag articleTag = ArticleTag.builder().article(article).tag(tag).build();
                article.getArticleTags().add(articleTag);
            }
        }

        if (request.getItem() != null) {
            if (request.getItem().isForSale()) {
                if (article.getItem() != null) {
                    article.getItem().update(request.getItem().getPrice(), request.getItem().getCondition(), request.getItem().getTradeType());
                } else {
                    Item item = Item.builder()
                            .article(article)
                            .price(request.getItem().getPrice())
                            .condition(request.getItem().getCondition())
                            .tradeType(request.getItem().getTradeType())
                            .build();
                    itemRepository.save(item);
                }
            } else if (article.getItem() != null) {
                itemRepository.delete(article.getItem());
            }
        }
    }

    @CacheEvict(value = "articles", allEntries = true)
    @Transactional
    public void deleteArticle(UUID id, UUID userId) {
        Article article = articleRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new EntityNotFoundException("Article not found or access denied"));
        articleRepository.delete(article);
    }

    @CacheEvict(value = "articles", allEntries = true)
    @Transactional
    public void markItemAsSold(UUID articleId) {
        Article article = articleRepository.findPublishedById(articleId)
                .orElseThrow(() -> new EntityNotFoundException("Article not found: " + articleId));
        if (article.getItem() == null) {
            throw new IllegalArgumentException("판매 상품이 등록되지 않은 아티클입니다.");
        }
        if (article.getItem().getIsSold()) {
            throw new IllegalArgumentException("이미 판매 완료된 상품입니다.");
        }
        article.getItem().markAsSold();
    }
}
