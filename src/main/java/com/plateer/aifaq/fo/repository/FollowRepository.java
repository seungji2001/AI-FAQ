package com.plateer.aifaq.fo.repository;

import com.plateer.aifaq.fo.entity.Follow;
import com.plateer.aifaq.fo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FollowRepository extends JpaRepository<Follow, Follow.FollowId> {
    long countByFollowing(User following);
}
