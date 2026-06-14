package com.plateer.thingz.fo.controller;

import com.plateer.thingz.config.auth.CustomOAuth2User;
import com.plateer.thingz.fo.dto.DeviceTokenRequest;
import com.plateer.thingz.fo.service.DeviceTokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Device", description = "기기 토큰 API")
@RestController
@RequestMapping("/api/fo/devices")
@RequiredArgsConstructor
public class DeviceTokenController {

    private final DeviceTokenService deviceTokenService;

    @Operation(summary = "FCM 기기 토큰 등록", description = "앱 시작 시 FCM 토큰을 서버에 등록합니다.")
    @PostMapping("/token")
    public ResponseEntity<Void> registerToken(
            @Valid @RequestBody DeviceTokenRequest request,
            @AuthenticationPrincipal CustomOAuth2User user) {
        deviceTokenService.register(user.getUserId(), request.getToken(), request.getPlatform());
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "FCM 기기 토큰 삭제", description = "로그아웃 시 FCM 토큰을 서버에서 삭제합니다.")
    @DeleteMapping("/token")
    public ResponseEntity<Void> removeToken(
            @Valid @RequestBody DeviceTokenRequest request,
            @AuthenticationPrincipal CustomOAuth2User user) {
        deviceTokenService.remove(request.getToken());
        return ResponseEntity.noContent().build();
    }
}
