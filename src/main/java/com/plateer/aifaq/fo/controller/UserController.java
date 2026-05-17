package com.plateer.aifaq.fo.controller;

import com.plateer.aifaq.config.auth.CustomOAuth2User;
import com.plateer.aifaq.fo.dto.ArticleListDto;
import com.plateer.aifaq.fo.dto.UserDto;
import com.plateer.aifaq.fo.dto.UserUpdateRequest;
import com.plateer.aifaq.fo.service.ArticleService;
import com.plateer.aifaq.fo.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "User", description = "유저 API")
@RestController
@RequestMapping("/api/fo/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final ArticleService articleService;

    @Operation(summary = "활성 유저 목록 조회", description = "isActive=true인 유저 목록을 반환합니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "조회 성공",
                content = @Content(schema = @Schema(implementation = UserDto.class)))
        }
    )
    @GetMapping
    public ResponseEntity<List<UserDto>> getActiveUsers() {
        return ResponseEntity.ok(userService.getActiveUsers());
    }

    @Operation(summary = "유저 프로필 수정", description = "로그인한 유저의 프로필을 수정합니다.")
    @PutMapping("/me")
    public ResponseEntity<Void> updateMyProfile(
            @RequestBody UserUpdateRequest request,
            @AuthenticationPrincipal CustomOAuth2User user) {
        userService.updateMyProfile(user.getUserId(), request);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "프로필 사진 업데이트", description = "S3에 업로드한 이미지 URL로 프로필 사진을 변경합니다.")
    @PatchMapping("/me/avatar")
    public ResponseEntity<Void> updateAvatar(
            @RequestBody java.util.Map<String, String> body,
            @AuthenticationPrincipal CustomOAuth2User user) {
        userService.updateAvatar(user.getUserId(), body.get("avatarUrl"));
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "유저 프로필 조회", description = "특정 유저의 프로필 정보를 반환합니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "유저 없음")
        }
    )
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(
            @Parameter(description = "유저 UUID", required = true) @PathVariable String id,
            @AuthenticationPrincipal CustomOAuth2User principal) {
        UUID userId = resolveUserId(id, principal);
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @Operation(summary = "유저 아티클 목록 조회", description = "특정 유저가 발행한 아티클 목록을 반환합니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "유저 없음")
        }
    )
    @GetMapping("/{id}/articles")
    public ResponseEntity<List<ArticleListDto>> getUserArticles(
            @Parameter(description = "유저 UUID", required = true) @PathVariable String id,
            @AuthenticationPrincipal CustomOAuth2User principal) {
        UUID userId = resolveUserId(id, principal);
        return ResponseEntity.ok(articleService.getArticlesByUser(userId));
    }

    private UUID resolveUserId(String id, CustomOAuth2User principal) {
        if ("me".equals(id)) {
            if (principal == null) throw new IllegalArgumentException("로그인이 필요합니다.");
            return principal.getUserId();
        }
        return UUID.fromString(id);
    }
}
