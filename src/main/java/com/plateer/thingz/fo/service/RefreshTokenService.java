package com.plateer.thingz.fo.service;

import com.plateer.thingz.fo.entity.RefreshToken;
import com.plateer.thingz.fo.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private static final Duration REFRESH_TOKEN_TTL = Duration.ofDays(7);
    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    public void store(UUID userId, String token) {
        String tokenHash = hash(token);
        LocalDateTime expiresAt = LocalDateTime.now().plus(REFRESH_TOKEN_TTL);
        RefreshToken refreshToken = refreshTokenRepository.findById(userId)
                .orElseGet(() -> RefreshToken.builder()
                        .userId(userId)
                        .tokenHash(tokenHash)
                        .expiresAt(expiresAt)
                        .updatedAt(LocalDateTime.now())
                        .build());
        refreshToken.update(tokenHash, expiresAt);
        refreshTokenRepository.save(refreshToken);
    }

    @Transactional(readOnly = true)
    public boolean matches(UUID userId, String token) {
        return refreshTokenRepository.findById(userId)
                .filter(saved -> saved.getExpiresAt().isAfter(LocalDateTime.now()))
                .map(saved -> MessageDigest.isEqual(
                        saved.getTokenHash().getBytes(StandardCharsets.UTF_8),
                        hash(token).getBytes(StandardCharsets.UTF_8)
                ))
                .orElse(false);
    }

    @Transactional
    public void delete(UUID userId) {
        refreshTokenRepository.deleteById(userId);
    }

    private String hash(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 is unavailable", e);
        }
    }
}
