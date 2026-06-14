package com.plateer.thingz.fo.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.plateer.thingz.config.JwtTokenProvider;
import com.plateer.thingz.fo.dto.TokenDto;
import com.plateer.thingz.fo.entity.User;
import com.plateer.thingz.fo.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigInteger;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.RSAPublicKeySpec;
import java.time.Duration;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AppleAuthService {

    private static final String APPLE_KEYS_URL = "https://appleid.apple.com/auth/keys";

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate<String, Object> redisTemplate;
    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;

    @Value("${apple.bundle-id}")
    private String bundleId;

    @Transactional
    public TokenDto verifyAndLogin(String identityToken, String fullName) {
        try {
            Claims claims = verifyIdentityToken(identityToken);

            String appleId = claims.getSubject();
            String email = claims.get("email", String.class);

            User user = userRepository.findByAppleId(appleId)
                    .orElseGet(() -> createAppleUser(appleId, email, fullName));

            String accessToken = jwtTokenProvider.createAccessToken(user.getId(), user.getUsername());
            String refreshToken = jwtTokenProvider.createRefreshToken(user.getId());
            redisTemplate.opsForValue().set("refresh:" + user.getId(), refreshToken, Duration.ofDays(7));

            return new TokenDto(accessToken, refreshToken);
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            log.error("Apple login failed", e);
            throw new IllegalArgumentException("Apple 로그인 검증에 실패했습니다.");
        }
    }

    @SuppressWarnings("unchecked")
    private Claims verifyIdentityToken(String identityToken) throws Exception {
        String[] parts = identityToken.split("\\.");
        if (parts.length != 3) {
            throw new IllegalArgumentException("잘못된 identity token 형식입니다.");
        }

        String headerJson = new String(Base64.getUrlDecoder().decode(parts[0]));
        Map<String, String> header = objectMapper.readValue(headerJson, Map.class);
        String kid = header.get("kid");

        PublicKey publicKey = fetchApplePublicKey(kid);

        Claims claims = Jwts.parser()
                .verifyWith(publicKey)
                .build()
                .parseSignedClaims(identityToken)
                .getPayload();

        // Expo Go 개발 환경에서는 aud가 host.exp.Exponent로 발급됨
        boolean validAudience = claims.getAudience().contains(bundleId)
                || claims.getAudience().contains("host.exp.Exponent");
        if (!validAudience) {
            throw new IllegalArgumentException("identity token audience가 일치하지 않습니다.");
        }

        return claims;
    }

    @SuppressWarnings("unchecked")
    private PublicKey fetchApplePublicKey(String kid) throws Exception {
        Map<String, Object> jwks = webClientBuilder.build()
                .get()
                .uri(APPLE_KEYS_URL)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        List<Map<String, String>> keys = (List<Map<String, String>>) jwks.get("keys");
        Map<String, String> matchedKey = keys.stream()
                .filter(k -> kid.equals(k.get("kid")))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Apple 공개키를 찾을 수 없습니다: " + kid));

        byte[] nBytes = Base64.getUrlDecoder().decode(matchedKey.get("n"));
        byte[] eBytes = Base64.getUrlDecoder().decode(matchedKey.get("e"));

        RSAPublicKeySpec spec = new RSAPublicKeySpec(
                new BigInteger(1, nBytes),
                new BigInteger(1, eBytes)
        );
        return KeyFactory.getInstance("RSA").generatePublic(spec);
    }

    private User createAppleUser(String appleId, String email, String fullName) {
        String username = generateAppleUsername(appleId);
        String displayName = (fullName != null && !fullName.isBlank()) ? fullName : username;

        User user = User.builder()
                .appleId(appleId)
                .email(email)
                .username(username)
                .displayName(displayName)
                .isActive(true)
                .build();

        return userRepository.save(user);
    }

    private String generateAppleUsername(String appleId) {
        String base = "apple_" + appleId.replaceAll("[^a-zA-Z0-9]", "");
        String candidate = base.length() <= 50 ? base : base.substring(0, 50);

        if (!userRepository.existsByUsername(candidate)) {
            return candidate;
        }
        // 충돌 시 UUID suffix 사용 (apple_ + 8자 = 14자, 50자 제한 이내)
        String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        return "apple_" + suffix;
    }
}
