package com.plateer.thingz.fo.service;

import com.plateer.thingz.fo.entity.DeviceToken;
import com.plateer.thingz.fo.repository.DeviceTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeviceTokenService {

    private final DeviceTokenRepository deviceTokenRepository;

    @Transactional
    public void register(UUID userId, String token, String platform) {
        if (deviceTokenRepository.findByToken(token).isPresent()) {
            return;
        }
        deviceTokenRepository.save(DeviceToken.builder()
                .userId(userId)
                .token(token)
                .platform(platform)
                .build());
    }

    @Transactional
    public void remove(String token) {
        deviceTokenRepository.deleteByToken(token);
    }
}
