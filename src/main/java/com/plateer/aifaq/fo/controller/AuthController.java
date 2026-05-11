package com.plateer.aifaq.fo.controller;

import com.plateer.aifaq.config.JwtTokenProvider;
import com.plateer.aifaq.fo.dto.TokenDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Tag(name = "Auth", description = "인증 API")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate<String, Object> redisTemplate;

    @Operation(summary = "토큰 재발급", description = "Refresh Token으로 새로운 Access/Refresh Token을 발급합니다.")
    @PostMapping("/refresh")
    public ResponseEntity<TokenDto> refresh(@RequestHeader("X-Refresh-Token") String refreshToken) {
        if (!jwtTokenProvider.isValid(refreshToken)) {
            return ResponseEntity.status(401).build();
        }

        UUID userId = jwtTokenProvider.getUserId(refreshToken);
        String stored = (String) redisTemplate.opsForValue().get("refresh:" + userId);

        if (!refreshToken.equals(stored)) {
            return ResponseEntity.status(401).build();
        }

        String newAccessToken = jwtTokenProvider.createAccessToken(userId, jwtTokenProvider.getUsername(refreshToken));
        String newRefreshToken = jwtTokenProvider.createRefreshToken(userId);

        redisTemplate.opsForValue().set("refresh:" + userId, newRefreshToken,
                java.time.Duration.ofDays(7));

        return ResponseEntity.ok(new TokenDto(newAccessToken, newRefreshToken));
    }

    @Operation(summary = "로그아웃", description = "Refresh Token을 Redis에서 삭제합니다.")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("X-Refresh-Token") String refreshToken) {
        if (jwtTokenProvider.isValid(refreshToken)) {
            UUID userId = jwtTokenProvider.getUserId(refreshToken);
            redisTemplate.delete("refresh:" + userId);
        }
        return ResponseEntity.noContent().build();
    }
}
