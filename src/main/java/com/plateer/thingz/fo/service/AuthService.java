package com.plateer.thingz.fo.service;

import com.plateer.thingz.config.JwtTokenProvider;
import com.plateer.thingz.fo.dto.LoginRequest;
import com.plateer.thingz.fo.dto.SignupRequest;
import com.plateer.thingz.fo.dto.TokenDto;
import com.plateer.thingz.fo.entity.User;
import com.plateer.thingz.fo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;

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

        refreshTokenService.store(user.getId(), refreshToken);

        return new TokenDto(accessToken, refreshToken);
    }

    @Transactional
    public TokenDto refresh(String refreshToken) {
        if (!jwtTokenProvider.isValid(refreshToken)) {
            throw new IllegalArgumentException("유효하지 않은 Refresh Token입니다.");
        }

        UUID userId = jwtTokenProvider.getUserId(refreshToken);
        if (!refreshTokenService.matches(userId, refreshToken)) {
            throw new IllegalArgumentException("만료되었거나 폐기된 Refresh Token입니다.");
        }

        User user = userRepository.findById(userId)
                .filter(found -> Boolean.TRUE.equals(found.getIsActive()))
                .orElseThrow(() -> new IllegalArgumentException("활성 사용자 정보를 찾을 수 없습니다."));

        String newAccessToken = jwtTokenProvider.createAccessToken(userId, user.getUsername());
        String newRefreshToken = jwtTokenProvider.createRefreshToken(userId);
        refreshTokenService.store(userId, newRefreshToken);
        return new TokenDto(newAccessToken, newRefreshToken);
    }

    @Transactional
    public void logout(String refreshToken) {
        if (jwtTokenProvider.isValid(refreshToken)) {
            refreshTokenService.delete(jwtTokenProvider.getUserId(refreshToken));
        }
    }
}
