package com.plateer.aifaq.fo.repository;

import com.plateer.aifaq.fo.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TagRepository extends JpaRepository<Tag, UUID> {
    Optional<Tag> findByName(String name);

    // 발행된 아티클 기준으로 사용 횟수 상위 태그 이름 목록 반환
    @Query("""
        SELECT t.name FROM ArticleTag at
        JOIN at.tag t
        JOIN at.article a
        WHERE a.isPublished = true
        GROUP BY t.id, t.name
        ORDER BY COUNT(at.article) DESC
        LIMIT :limit
        """)
    List<String> findPopularTagNames(@Param("limit") int limit);
}
