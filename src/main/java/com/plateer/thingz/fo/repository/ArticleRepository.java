package com.plateer.thingz.fo.repository;

import com.plateer.thingz.fo.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ArticleRepository extends JpaRepository<Article, UUID> {

    @Query("SELECT DISTINCT a FROM Article a JOIN FETCH a.user u LEFT JOIN FETCH a.item WHERE a.isPublished = true AND u.isActive = true ORDER BY a.publishedAt DESC")
    List<Article> findPublishedArticles();

    @Query("SELECT a FROM Article a JOIN FETCH a.user u LEFT JOIN FETCH a.item WHERE a.id = :id AND a.isPublished = true AND u.isActive = true")
    Optional<Article> findPublishedById(@Param("id") UUID id);

    @Query("SELECT DISTINCT a FROM Article a JOIN FETCH a.user u LEFT JOIN FETCH a.item JOIN a.articleTags at JOIN at.tag t WHERE t.name = :tagName AND a.isPublished = true AND u.isActive = true ORDER BY a.publishedAt DESC")
    List<Article> findByTagName(@Param("tagName") String tagName);

    @Query("SELECT DISTINCT a FROM Article a JOIN FETCH a.user u LEFT JOIN FETCH a.item WHERE u.id = :userId AND a.isPublished = true ORDER BY a.publishedAt DESC")
    List<Article> findPublishedByUserId(@Param("userId") UUID userId);

    @Query("SELECT DISTINCT a FROM Article a JOIN FETCH a.user u LEFT JOIN FETCH a.item WHERE u.id = :userId AND a.isPublished = false ORDER BY a.createdAt DESC")
    List<Article> findDraftsByUserId(@Param("userId") UUID userId);

    @Query("SELECT a FROM Article a JOIN FETCH a.user u LEFT JOIN FETCH a.item WHERE a.id = :id AND u.id = :userId")
    java.util.Optional<Article> findByIdAndUserId(@Param("id") UUID id, @Param("userId") UUID userId);
}
