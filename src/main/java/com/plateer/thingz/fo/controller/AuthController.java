package com.plateer.thingz.fo.controller;

import com.plateer.thingz.fo.dto.AppleLoginRequest;
import com.plateer.thingz.fo.dto.LoginRequest;
import com.plateer.thingz.fo.dto.SignupRequest;
import com.plateer.thingz.fo.dto.TokenDto;
import com.plateer.thingz.fo.service.AppleAuthService;
import com.plateer.thingz.fo.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Auth", description = "인증 API")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AppleAuthService appleAuthService;

    @Operation(summary = "이메일 회원가입")
    @PostMapping("/signup")
    public ResponseEntity<Void> signup(@Valid @RequestBody SignupRequest request) {
        authService.signup(request);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Apple 로그인", description = "Sign in with Apple로 발급된 identityToken을 검증하고 JWT를 반환합니다.")
    @PostMapping("/apple")
    public ResponseEntity<TokenDto> appleLogin(@Valid @RequestBody AppleLoginRequest request) {
        return ResponseEntity.ok(appleAuthService.verifyAndLogin(request.getIdentityToken(), request.getFullName()));
    }

    @Operation(summary = "이메일 로그인")
    @PostMapping("/login")
    public ResponseEntity<TokenDto> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @Operation(summary = "토큰 재발급", description = "Refresh Token으로 새로운 Access/Refresh Token을 발급합니다.")
    @PostMapping("/refresh")
    public ResponseEntity<TokenDto> refresh(@RequestHeader("X-Refresh-Token") String refreshToken) {
        try {
            return ResponseEntity.ok(authService.refresh(refreshToken));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).build();
        }
    }

    @Operation(summary = "로그아웃", description = "Refresh Token을 Redis에서 삭제합니다.")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("X-Refresh-Token") String refreshToken) {
        authService.logout(refreshToken);
        return ResponseEntity.noContent().build();
    }
}
