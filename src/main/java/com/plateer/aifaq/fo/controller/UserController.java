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

    @Operation(summary = "유저 프로필 조회", description = "특정 유저의 프로필 정보를 반환합니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "유저 없음")
        }
    )
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(
            @Parameter(description = "유저 UUID", required = true) @PathVariable UUID id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @Operation(summary = "유저 아티클 목록 조회", description = "특정 유저가 발행한 아티클 목록을 반환합니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "유저 없음")
        }
    )
    @GetMapping("/{id}/articles")
    public ResponseEntity<List<ArticleListDto>> getUserArticles(
            @Parameter(description = "유저 UUID", required = true) @PathVariable UUID id) {
        return ResponseEntity.ok(articleService.getArticlesByUser(id));
    }
}
