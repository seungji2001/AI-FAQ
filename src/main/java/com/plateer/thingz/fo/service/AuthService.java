package com.plateer.thingz.fo.service;

import com.plateer.thingz.config.JwtTokenProvider;
import com.plateer.thingz.fo.dto.LoginRequest;
import com.plateer.thingz.fo.dto.SignupRequest;
import com.plateer.thingz.fo.dto.TokenDto;
import com.plateer.thingz.fo.entity.User;
import com.plateer.thingz.fo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final RedisTemplate<String, Object> redisTemplate;

    @Transactional
    public void signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("이미 사용 중인 사용자명입니다.");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .username(request.getUsername())
                .isActive(true)
                .build();

        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public TokenDto login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));

        if (user.getPassword() == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        String accessToken = jwtTokenProvider.createAccessToken(user.getId(), user.getUsername());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getId());

        try {
            redisTemplate.opsForValue().set("refresh:" + user.getId(), refreshToken, Duration.ofDays(7));
        } catch (Exception ignored) {
            // Redis 미설정 환경에서도 로그인 완료되도록 허용
        }

        return new TokenDto(accessToken, refreshToken);
    }
}
