package com.plateer.aifaq.fo.repository;

import com.plateer.aifaq.fo.entity.Follow;
import com.plateer.aifaq.fo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FollowRepository extends JpaRepository<Follow, Follow.FollowId> {
    long countByFollowing(User following);
    List<Follow> findByFollowing(User following);  // 팔로워 목록 (이 유저를 팔로우한 사람들)
    List<Follow> findByFollower(User follower);    // 팔로잉 목록 (이 유저가 팔로우한 사람들)
}
