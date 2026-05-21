package com.plateer.thingz.fo.repository;

import com.plateer.thingz.fo.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    @EntityGraph(attributePaths = {"articles"})
    List<User> findByIsActiveTrueOrderByCreatedAtDesc();

    Optional<User> findByKakaoId(Long kakaoId);

    Optional<User> findByAppleId(String appleId);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
}
