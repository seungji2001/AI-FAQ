package com.plateer.thingz.fo.repository;

import com.plateer.thingz.fo.entity.DeviceToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DeviceTokenRepository extends JpaRepository<DeviceToken, Long> {

    Optional<DeviceToken> findByToken(String token);

    void deleteByToken(String token);

    List<DeviceToken> findAllByUserId(UUID userId);

    void deleteAllByUserId(UUID userId);
}
