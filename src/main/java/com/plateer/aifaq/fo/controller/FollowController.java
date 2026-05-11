package com.plateer.aifaq.fo.controller;

import com.plateer.aifaq.fo.dto.FollowRequest;
import com.plateer.aifaq.fo.service.FollowService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Tag(name = "Follow", description = "팔로우 API")
@RestController
@RequestMapping("/api/fo/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class FollowController {

    private final FollowService followService;

    @Operation(summary = "팔로우", description = "특정 유저를 팔로우합니다.",
        responses = {
            @ApiResponse(responseCode = "204", description = "팔로우 성공"),
            @ApiResponse(responseCode = "400", description = "이미 팔로우 중 또는 자기 자신 팔로우"),
            @ApiResponse(responseCode = "404", description = "유저 없음")
        }
    )
    @PostMapping("/{id}/follow")
    public ResponseEntity<Void> follow(
            @Parameter(description = "팔로우 대상 유저 UUID", required = true) @PathVariable UUID id,
            @Valid @RequestBody FollowRequest request) {
        followService.follow(id, request.getFollowerId());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "언팔로우", description = "특정 유저를 언팔로우합니다.",
        responses = {
            @ApiResponse(responseCode = "204", description = "언팔로우 성공"),
            @ApiResponse(responseCode = "404", description = "팔로우 관계 없음")
        }
    )
    @DeleteMapping("/{id}/follow")
    public ResponseEntity<Void> unfollow(
            @Parameter(description = "언팔로우 대상 유저 UUID", required = true) @PathVariable UUID id,
            @Valid @RequestBody FollowRequest request) {
        followService.unfollow(id, request.getFollowerId());
        return ResponseEntity.noContent().build();
    }
}
