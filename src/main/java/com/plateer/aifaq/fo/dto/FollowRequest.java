package com.plateer.aifaq.fo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@NoArgsConstructor
@Schema(description = "팔로우 요청")
public class FollowRequest {

    @NotNull(message = "팔로워 ID는 필수입니다")
    @Schema(description = "팔로우 하는 유저 UUID")
    private UUID followerId;
}
