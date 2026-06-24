package com.plateer.thingz.fo.service;

import com.plateer.thingz.fo.dto.UserDto;
import com.plateer.thingz.fo.dto.UserUpdateRequest;
import com.plateer.thingz.fo.entity.User;
import com.plateer.thingz.fo.repository.FollowRepository;
import com.plateer.thingz.fo.repository.DeviceTokenRepository;
import com.plateer.thingz.fo.repository.UserRepository;
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
public class UserService {

    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final DeviceTokenRepository deviceTokenRepository;
    private final RefreshTokenService refreshTokenService;

    @Cacheable(value = "users", key = "'active'")
    public List<UserDto> getActiveUsers() {
        return userRepository.findByIsActiveTrueOrderByCreatedAtDesc().stream()
                .map(u -> new UserDto(u, followRepository.countByFollowing(u), followRepository.countByFollower(u)))
                .toList();
    }

    public UserDto getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + id));
        return new UserDto(user, followRepository.countByFollowing(user), followRepository.countByFollower(user));
    }

    @CacheEvict(value = "users", allEntries = true)
    @Transactional
    public void updateMyProfile(UUID userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));
        user.editProfile(request.getDisplayName(), request.getBio(), request.getInstagramId(), request.getKakaoUrl());
    }

    @CacheEvict(value = "users", allEntries = true)
    @Transactional
    public void updateAvatar(UUID userId, String avatarUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));
        user.updateAvatar(avatarUrl);
    }

    @CacheEvict(value = "users", allEntries = true)
    @Transactional
    public void deactivateMyAccount(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));
        followRepository.deleteByFollowerOrFollowing(user, user);
        deviceTokenRepository.deleteAllByUserId(userId);
        refreshTokenService.delete(userId);
        user.deactivate();
    }
}
