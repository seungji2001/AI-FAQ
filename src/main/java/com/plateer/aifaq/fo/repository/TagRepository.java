package com.plateer.aifaq.fo.repository;

import com.plateer.aifaq.fo.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TagRepository extends JpaRepository<Tag, UUID> {
    Optional<Tag> findByName(String name);

    @Query("""
        SELECT t.name FROM Article a
        JOIN a.articleTags at
        JOIN at.tag t
        WHERE a.isPublished = true
        GROUP BY t.id, t.name
        ORDER BY COUNT(a) DESC
        """)
    List<String> findPopularTagNames(Pageable pageable);
}
