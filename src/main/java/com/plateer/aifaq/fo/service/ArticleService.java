package com.plateer.aifaq.fo.service;

import com.plateer.aifaq.fo.dto.ArticleCreateRequest;
import com.plateer.aifaq.fo.dto.ArticleDetailDto;
import com.plateer.aifaq.fo.dto.ArticleListDto;
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

    @CacheEvict(value = "articles", key = "'all'")
    @Transactional
    public UUID createArticle(ArticleCreateRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + request.getUserId()));

        Article article = Article.builder()
                .user(user)
                .title(request.getTitle())
                .content(request.getContent())
                .isPublished(false)
                .build();

        // 이미지
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

        // 태그
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

        // 판매 물건
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
}
