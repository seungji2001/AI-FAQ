package com.plateer.aifaq.fo.service;

import com.plateer.aifaq.fo.dto.UserDto;
import com.plateer.aifaq.fo.entity.Follow;
import com.plateer.aifaq.fo.entity.User;
import com.plateer.aifaq.fo.repository.FollowRepository;
import com.plateer.aifaq.fo.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    @Transactional
    public void follow(UUID followingId, UUID followerId) {
        if (followerId.equals(followingId)) {
            throw new IllegalArgumentException("자기 자신을 팔로우할 수 없습니다.");
        }

        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + followerId));
        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + followingId));

        Follow.FollowId followId = new Follow.FollowId(followerId, followingId);
        if (followRepository.existsById(followId)) {
            throw new IllegalArgumentException("이미 팔로우 중입니다.");
        }

        followRepository.save(Follow.builder()
                .follower(follower)
                .following(following)
                .build());
    }

    @Transactional
    public void unfollow(UUID followingId, UUID followerId) {
        Follow.FollowId followId = new Follow.FollowId(followerId, followingId);
        if (!followRepository.existsById(followId)) {
            throw new EntityNotFoundException("팔로우 관계를 찾을 수 없습니다.");
        }
        followRepository.deleteById(followId);
    }

    public boolean isFollowing(UUID followingId, UUID followerId) {
        return followRepository.existsById(new Follow.FollowId(followerId, followingId));
    }

    // 나를 팔로우한 사람들 (팔로워 목록)
    public List<UserDto> getFollowers(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));
        return followRepository.findByFollowing(user).stream()
                .map(f -> new UserDto(f.getFollower(), followRepository.countByFollowing(f.getFollower())))
                .toList();
    }

    // 내가 팔로우한 사람들 (팔로잉 목록)
    public List<UserDto> getFollowing(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));
        return followRepository.findByFollower(user).stream()
                .map(f -> new UserDto(f.getFollowing(), followRepository.countByFollowing(f.getFollowing())))
                .toList();
    }
}
