package com.plateer.thingz.fo.controller;

import com.plateer.thingz.config.auth.CustomOAuth2User;
import com.plateer.thingz.fo.dto.UserDto;
import com.plateer.thingz.fo.service.FollowService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Tag(name = "Follow", description = "팔로우 API")
@RestController
@RequestMapping("/api/fo/users")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    @Operation(summary = "팔로우 여부 확인", description = "로그인한 유저가 특정 유저를 팔로우하고 있는지 확인합니다.")
    @GetMapping("/{id}/is-following")
    public ResponseEntity<Map<String, Boolean>> isFollowing(
            @Parameter(description = "확인 대상 유저 UUID", required = true) @PathVariable UUID id,
            @AuthenticationPrincipal CustomOAuth2User user) {
        if (user == null) {
            return ResponseEntity.ok(Map.of("following", false));
        }
        return ResponseEntity.ok(Map.of("following", followService.isFollowing(id, user.getUserId())));
    }

    @Operation(summary = "팔로우", description = "로그인한 유저가 특정 유저를 팔로우합니다.",
        responses = {
            @ApiResponse(responseCode = "204", description = "팔로우 성공"),
            @ApiResponse(responseCode = "400", description = "이미 팔로우 중 또는 자기 자신 팔로우"),
            @ApiResponse(responseCode = "404", description = "유저 없음")
        }
    )
    @PostMapping("/{id}/follow")
    public ResponseEntity<Void> follow(
            @Parameter(description = "팔로우 대상 유저 UUID", required = true) @PathVariable UUID id,
            @AuthenticationPrincipal CustomOAuth2User user) {
        followService.follow(id, user.getUserId());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "언팔로우", description = "로그인한 유저가 특정 유저를 언팔로우합니다.",
        responses = {
            @ApiResponse(responseCode = "204", description = "언팔로우 성공"),
            @ApiResponse(responseCode = "404", description = "팔로우 관계 없음")
        }
    )
    @DeleteMapping("/{id}/follow")
    public ResponseEntity<Void> unfollow(
            @Parameter(description = "언팔로우 대상 유저 UUID", required = true) @PathVariable UUID id,
            @AuthenticationPrincipal CustomOAuth2User user) {
        followService.unfollow(id, user.getUserId());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "팔로워 목록 조회", description = "특정 유저를 팔로우하는 사람 목록을 반환합니다.")
    @GetMapping("/{id}/followers")
    public ResponseEntity<List<UserDto>> getFollowers(
            @Parameter(description = "조회 대상 유저 UUID", required = true) @PathVariable UUID id) {
        return ResponseEntity.ok(followService.getFollowers(id));
    }

    @Operation(summary = "내 팔로잉 목록 조회", description = "로그인한 유저가 팔로우하는 사람 목록을 반환합니다.")
    @GetMapping("/me/following")
    public ResponseEntity<List<UserDto>> getMyFollowing(@AuthenticationPrincipal CustomOAuth2User user) {
        return ResponseEntity.ok(followService.getFollowing(user.getUserId()));
    }

    @Operation(summary = "팔로잉 목록 조회", description = "특정 유저가 팔로우하는 사람 목록을 반환합니다.")
    @GetMapping("/{id}/following")
    public ResponseEntity<List<UserDto>> getFollowing(
            @Parameter(description = "조회 대상 유저 UUID", required = true) @PathVariable UUID id) {
        return ResponseEntity.ok(followService.getFollowing(id));
    }
}
