package com.plateer.aifaq.fo.repository;

import com.plateer.aifaq.fo.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ArticleRepository extends JpaRepository<Article, UUID> {

    @Query("SELECT DISTINCT a FROM Article a JOIN FETCH a.user u LEFT JOIN FETCH a.item WHERE a.isPublished = true AND u.isActive = true ORDER BY a.publishedAt DESC")
    List<Article> findPublishedArticles();

    @Query("SELECT a FROM Article a JOIN FETCH a.user u LEFT JOIN FETCH a.item WHERE a.id = :id AND a.isPublished = true AND u.isActive = true")
    Optional<Article> findPublishedById(UUID id);
}
